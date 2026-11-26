/**
 * Forced alignment of a TTS take against the script using a local whisper.cpp
 * transcription (word timestamps). Gives exact scene cuts and per-word caption timing.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { toCaptions, transcribe } from "@remotion/install-whisper-cpp";

const WHISPER_VERSION = "1.5.5";

export type Aligned = {
  /** Sample index where each line's clip starts / ends. */
  cuts: { start: number; end: number }[];
  /** Per line: start time (s) of each script word, relative to that line's clip start. */
  wordStarts: number[][];
};

const norm = (w: string) =>
  w
    .toLowerCase()
    .replace(/£/g, "")
    .replace(/[^a-z0-9]/g, "");

function wav16k(pcm: Int16Array, rate: number): Buffer {
  const n = Math.floor((pcm.length * 16000) / rate);
  const out = new Int16Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i * rate) / 16000;
    const j = Math.floor(x);
    const f = x - j;
    out[i] = Math.round(pcm[j] * (1 - f) + (pcm[Math.min(j + 1, pcm.length - 1)] ?? 0) * f);
  }
  const data = Buffer.from(out.buffer);
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);
  h.writeUInt32LE(36 + data.length, 4);
  h.write("WAVEfmt ", 8);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(1, 22);
  h.writeUInt32LE(16000, 24);
  h.writeUInt32LE(32000, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write("data", 36);
  h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
}

/** Needleman–Wunsch over words; returns transcript index for each script word (or -1). */
function alignWords(script: string[], heard: string[]): number[] {
  const a = script.map(norm);
  const b = heard.map(norm);
  const sim = (x: string, y: string) => (x === y ? 3 : x.length >= 3 && y.length >= 3 && (x.startsWith(y) || y.startsWith(x)) ? 1.5 : -1);
  const n = a.length;
  const m = b.length;
  const S = Array.from({ length: n + 1 }, () => new Float64Array(m + 1));
  for (let i = 1; i <= n; i++) S[i][0] = -i;
  for (let j = 1; j <= m; j++) S[0][j] = -j;
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++) S[i][j] = Math.max(S[i - 1][j - 1] + sim(a[i - 1], b[j - 1]), S[i - 1][j] - 1, S[i][j - 1] - 1);
  const map = new Array<number>(n).fill(-1);
  let i = n;
  let j = m;
  while (i > 0 && j > 0) {
    if (S[i][j] === S[i - 1][j - 1] + sim(a[i - 1], b[j - 1])) {
      map[i - 1] = j - 1; // match or substitution — both give usable timing
      i--;
      j--;
    } else if (S[i][j] === S[i - 1][j] - 1) i--;
    else j--;
  }
  return map;
}

export async function align(pcm: Int16Array, rate: number, lines: string[], workDir: string): Promise<Aligned> {
  const whisperPath = join(workDir, "whisper.cpp");
  if (!existsSync(join(whisperPath, "main"))) {
    throw new Error("whisper.cpp not installed. Run: npm run setup:whisper");
  }
  const tmp = join(workDir, "takes", "_align16k.wav");
  mkdirSync(join(workDir, "takes"), { recursive: true });
  writeFileSync(tmp, wav16k(pcm, rate));
  const out = await transcribe({
    inputPath: tmp,
    whisperPath,
    whisperCppVersion: WHISPER_VERSION,
    model: "base.en",
    tokenLevelTimestamps: true,
    language: "en",
    printOutput: false,
  });
  const heard = toCaptions({ whisperCppOutput: out })
    .captions.map((c) => ({ text: c.text.trim(), start: c.startMs / 1000, end: c.endMs / 1000 }))
    .filter((c) => norm(c.text));

  const scriptWords: { line: number; text: string }[] = [];
  lines.forEach((l, li) => l.split(/\s+/).filter(Boolean).forEach((w) => scriptWords.push({ line: li, text: w })));
  const map = alignWords(
    scriptWords.map((w) => w.text),
    heard.map((h) => h.text),
  );

  // Time per script word (interpolate any unmatched words).
  const times = scriptWords.map((_, i) => (map[i] >= 0 ? heard[map[i]] : null));
  const starts = times.map((t) => t?.start ?? NaN);
  const ends = times.map((t) => t?.end ?? NaN);
  for (let i = 0; i < starts.length; i++) {
    if (!Number.isNaN(starts[i])) continue;
    const prev = ends.slice(0, i).findLast((v) => !Number.isNaN(v)) ?? 0;
    const nextIdx = starts.findIndex((v, k) => k > i && !Number.isNaN(v));
    const next = nextIdx >= 0 ? starts[nextIdx] : pcm.length / rate;
    starts[i] = prev + (next - prev) * 0.3;
    ends[i] = prev + (next - prev) * 0.7;
  }

  const lineStart = lines.map((_, li) => Math.min(...starts.filter((_, i) => scriptWords[i].line === li)));
  const lineEnd = lines.map((_, li) => Math.max(...ends.filter((_, i) => scriptWords[i].line === li)));

  // Snap each boundary to the quietest 40ms window between the two lines.
  const hop = Math.round(rate / 100);
  const energy = (s: number) => {
    let e = 0;
    for (let k = s; k < Math.min(pcm.length, s + hop * 4); k++) e += Math.abs(pcm[k]);
    return e;
  };
  const boundaries: number[] = [];
  for (let li = 0; li < lines.length - 1; li++) {
    const a = Math.round(Math.min(lineEnd[li], lineStart[li + 1]) * rate - 0.12 * rate);
    const b = Math.round(Math.max(lineEnd[li], lineStart[li + 1]) * rate + 0.12 * rate);
    let best = a;
    let bestE = Infinity;
    for (let s = Math.max(0, a); s < Math.min(pcm.length, b); s += hop) {
      const e = energy(s);
      if (e < bestE) [best, bestE] = [s + hop * 2, e];
    }
    boundaries.push(best);
  }
  // Trim anything spoken before the first / after the last script word (e.g. the model
  // reading the style direction aloud), keeping a little natural lead-in and tail.
  const head = Math.max(0, Math.round((lineStart[0] - 0.08) * rate));
  const tail = Math.min(pcm.length, Math.round((lineEnd[lines.length - 1] + 0.3) * rate));
  if (lineStart[0] > 1) console.warn(`  trimmed ${lineStart[0].toFixed(1)}s of extra speech before the script`);
  const edges = [head, ...boundaries, tail];
  const cuts = lines.map((_, li) => ({ start: edges[li], end: edges[li + 1] }));
  const wordStarts = lines.map((_, li) =>
    starts.filter((_, i) => scriptWords[i].line === li).map((t) => Math.max(0, t - cuts[li].start / rate)),
  );
  return { cuts, wordStarts };
}
