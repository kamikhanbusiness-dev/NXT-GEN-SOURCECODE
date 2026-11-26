/**
 * Generates the voiceover with Gemini Flash TTS — ONE request per reel (the free
 * tier allows ~10 requests/day/model), then splits the audio into one clip per
 * scene at the pauses between lines, so every scene's length matches its line.
 *
 *   npm run voice            # all reels (key from reels/.env or GEMINI_API_KEY)
 *   npm run voice -- Reel2   # only reels whose id contains "Reel2"
 *   npm run voice -- --force # regenerate even if the script hasn't changed
 *
 * The raw take is kept in takes/ and split with a local whisper.cpp alignment
 * (scripts/align.ts), so re-splitting never spends API quota.
 *
 * Writes public/voice/<reel>/<n>.wav and src/voice-manifest.json (durations + word timings).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { reels, spoken } from "../src/reels.ts";
import { align } from "./align.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(root, "src/voice-manifest.json");

const key = process.env.GEMINI_API_KEY;
if (!key) {
  console.error("Missing GEMINI_API_KEY. Add it to reels/.env (see .env.example) or pass it inline.");
  process.exit(1);
}

const MODELS = process.env.GEMINI_TTS_MODEL
  ? [process.env.GEMINI_TTS_MODEL]
  : ["gemini-3.8-flash-tts", "gemini-3.1-flash-tts-preview", "gemini-3.8-flash-lite-tts", "gemini-2.5-flash-preview-tts"];

// Gemini TTS treats a short "Say …:" lead-in as direction and speaks only what follows.
// Longer instructions get read aloud, so keep this to one clause.
const STYLE = "Say in a warm, friendly local Nottingham East Midlands accent, upbeat and energetic like a local social media advert, with a clear pause between each line";

type Segment = { text: string; voice: string; file: string; seconds: number; words: number[] };
type Manifest = Record<string, { model: string; style: string; segments: Segment[] }>;

const manifest: Manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
const args = process.argv.slice(2);
const force = args.includes("--force");
const filter = args.find((a) => !a.startsWith("--"));
const exhausted = new Set<string>();

async function tts(text: string, voice: string): Promise<{ pcm: Int16Array; rate: number; model: string }> {
  for (const model of MODELS) {
    if (exhausted.has(model)) continue;
    for (let attempt = 1; attempt <= 4; attempt++) {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key! },
        body: JSON.stringify({
          contents: [{ parts: [{ text }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
          },
        }),
      });
      if (res.status === 404) {
        console.warn(`  ${model} not available, trying next model…`);
        exhausted.add(model);
        break;
      }
      if (res.status === 429) {
        const body = await res.text();
        if (/PerDay/i.test(body)) {
          console.warn(`  ${model}: daily free-tier quota used up, trying next model…`);
          exhausted.add(model);
          break;
        }
        const wait = Number(/"retryDelay":\s*"(\d+)s"/.exec(body)?.[1] ?? 2 ** attempt * 5) * 1000 + 1000;
        console.warn(`  ${model}: rate limited, retrying in ${Math.round(wait / 1000)}s…`);
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }
      if (res.status >= 500) {
        await new Promise((r) => setTimeout(r, 2 ** attempt * 4000));
        continue;
      }
      if (!res.ok) throw new Error(`${model} ${res.status}: ${await res.text()}`);
      const json = await res.json();
      const part = json.candidates?.[0]?.content?.parts?.find((p: { inlineData?: unknown }) => p.inlineData);
      if (!part) throw new Error(`${model} returned no audio: ${JSON.stringify(json).slice(0, 400)}`);
      const rate = Number(/rate=(\d+)/.exec(part.inlineData.mimeType)?.[1] ?? 24000);
      const buf = Buffer.from(part.inlineData.data, "base64");
      return { pcm: new Int16Array(buf.buffer, buf.byteOffset, buf.length / 2), rate, model };
    }
  }
  throw new Error(`No TTS model available (tried ${MODELS.join(", ")}). Free-tier quotas reset daily; try again later or enable billing.`);
}

/** Trim silence (keeping a short tail) and peak-normalise to -1 dBFS. */
function tidy(samples: Int16Array, rate: number): { out: Int16Array; offset: number } {
  const threshold = 400;
  let start = 0;
  let end = samples.length - 1;
  while (start < end && Math.abs(samples[start]) < threshold) start++;
  while (end > start && Math.abs(samples[end]) < threshold) end--;
  start = Math.max(0, start - Math.round(rate * 0.03));
  end = Math.min(samples.length - 1, end + Math.round(rate * 0.1));
  const out = samples.slice(start, end + 1);
  let peak = 1;
  for (const s of out) peak = Math.max(peak, Math.abs(s));
  const gain = Math.min(3, (32767 * 0.89) / peak);
  for (let i = 0; i < out.length; i++) out[i] = Math.round(out[i] * gain);
  return { out, offset: start };
}

function wav(pcm: Int16Array, rate: number): Buffer {
  const data = Buffer.from(pcm.buffer, pcm.byteOffset, pcm.byteLength);
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);
  h.writeUInt32LE(36 + data.length, 4);
  h.write("WAVEfmt ", 8);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20); // PCM
  h.writeUInt16LE(1, 22); // mono
  h.writeUInt32LE(rate, 24);
  h.writeUInt32LE(rate * 2, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write("data", 36);
  h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
}

const estimate = (t: string) => t.split(/\s+/).length / 2.75;

for (const reel of reels) {
  if (filter && !reel.id.includes(filter)) continue;
  const lines = reel.scenes.map((s) => spoken(s.voice));
  const prev = manifest[reel.id];
  const unchanged =
    prev?.style === STYLE &&
    prev.segments.length === lines.length &&
    prev.segments.every((s, i) => s.text === lines[i] && s.voice === reel.voice && existsSync(join(root, "public", s.file)));
  if (unchanged && !force) {
    console.log(`\n▶ ${reel.id}: unchanged, skipped`);
    continue;
  }

  console.log(`\n▶ ${reel.id} (voice: ${reel.voice})`);
  const prompt = `${STYLE}:\n\n${lines.join("\n\n")}`;
  const takeWav = join(root, "takes", `${reel.id}.wav`);
  const takeMeta = join(root, "takes", `${reel.id}.json`);
  let take: { pcm: Int16Array; rate: number; model: string };
  const meta = existsSync(takeMeta) ? JSON.parse(readFileSync(takeMeta, "utf8")) : null;
  if (!force && meta?.prompt === prompt && meta.voice === reel.voice && existsSync(takeWav)) {
    const buf = readFileSync(takeWav);
    take = { pcm: new Int16Array(buf.buffer.slice(buf.byteOffset + 44, buf.byteOffset + buf.length)), rate: buf.readUInt32LE(24), model: meta.model };
    console.log("  (re-using saved take)");
  } else {
    take = await tts(prompt, reel.voice);
    const took = take.pcm.length / take.rate;
    const expected = lines.reduce((n, l) => n + estimate(l), 0);
    if (took > expected * 1.9) {
      throw new Error(`${reel.id}: got ${took.toFixed(1)}s of audio for ~${expected.toFixed(1)}s of script — the model probably read the direction aloud. Shorten STYLE and retry.`);
    }
    mkdirSync(join(root, "takes"), { recursive: true });
    writeFileSync(takeWav, wav(take.pcm, take.rate));
    writeFileSync(takeMeta, JSON.stringify({ prompt, voice: reel.voice, model: take.model }, null, 2));
  }
  const { pcm, rate, model } = take;

  const { cuts, wordStarts } = await align(pcm, rate, lines, root);
  mkdirSync(join(root, "public/voice", reel.id), { recursive: true });
  const segments: Segment[] = cuts.map((c, i) => {
    const file = `voice/${reel.id}/${i}.wav`;
    const { out, offset } = tidy(pcm.slice(c.start, c.end), rate);
    writeFileSync(join(root, "public", file), wav(out, rate));
    const seconds = out.length / rate;
    const words = wordStarts[i].map((t) => Math.max(0, Math.round((t - offset / rate) * 1000) / 1000));
    const ratio = seconds / estimate(lines[i]);
    console.log(`  ${i + 1}. ${seconds.toFixed(2)}s${ratio < 0.45 || ratio > 2.2 ? "  ⚠ check split" : ""}  ${lines[i]}`);
    return { text: lines[i], voice: reel.voice, file, seconds, words };
  });
  manifest[reel.id] = { model, style: STYLE, segments };
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`  model: ${model}, total ${(pcm.length / rate).toFixed(1)}s`);
}
console.log("\n✔ Voiceover ready. Next: npm run render");
