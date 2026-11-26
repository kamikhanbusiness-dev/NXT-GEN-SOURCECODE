/**
 * Synthesises the background music loop and sound effects (original, royalty-free)
 * into public/audio/. Run once: `npm run sfx`.
 *
 *   music.wav  — 16s seamless loop, 120 BPM, I–V–vi–IV pop progression
 *   whoosh / impact / pop / thud / ding .wav
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const out = join(dirname(fileURLToPath(import.meta.url)), "../public/audio");
mkdirSync(out, { recursive: true });

// deterministic noise
let seed = 1234567;
const noise = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return (seed / 2 ** 32) * 2 - 1;
};
const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);
const lpCoef = (fc: number) => 1 - Math.exp((-2 * Math.PI * fc) / SR);

function save(name: string, buf: Float32Array, peak = 0.89) {
  let max = 1e-9;
  for (const v of buf) max = Math.max(max, Math.abs(v));
  const pcm = new Int16Array(buf.length);
  for (let i = 0; i < buf.length; i++) pcm[i] = Math.round(Math.tanh((buf[i] / max) * peak * 1.1) * 32767 * 0.95);
  const data = Buffer.from(pcm.buffer);
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);
  h.writeUInt32LE(36 + data.length, 4);
  h.write("WAVEfmt ", 8);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(1, 22);
  h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 2, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write("data", 36);
  h.writeUInt32LE(data.length, 40);
  writeFileSync(join(out, name), Buffer.concat([h, data]));
  console.log(`  ${name}  ${(buf.length / SR).toFixed(2)}s`);
}

/* ── music loop ────────────────────────────────────────────────────────── */
{
  const BPM = 120;
  const beat = 60 / BPM;
  const bar = beat * 4;
  const chords = [
    { notes: [60, 64, 67], bass: 48 }, // C
    { notes: [59, 62, 67], bass: 43 }, // G
    { notes: [57, 60, 64], bass: 45 }, // Am
    { notes: [57, 60, 65], bass: 41 }, // F
  ];
  const bars = 8;
  const N = Math.round(bars * bar * SR);
  const mix = new Float32Array(N);
  // Write with wrap-around so tails spill into the start → seamless loop.
  const add = (i: number, v: number) => (mix[((i % N) + N) % N] += v);

  for (let b = 0; b < bars; b++) {
    const chord = chords[b % 4];
    const barStart = b * bar;

    // Pad: detuned saws, low-passed, with kick side-chain pumping.
    const lp = [0, 0, 0];
    const len = Math.round(bar * SR);
    for (let k = 0; k < len; k++) {
      const t = k / SR;
      const sinceBeat = t % beat;
      const pump = 1 - 0.65 * Math.exp(-sinceBeat / 0.11);
      const edge = Math.min(1, t / 0.01, (bar - t) / 0.01);
      let s = 0;
      chord.notes.forEach((n, j) => {
        let v = 0;
        for (const d of [-0.08, 0, 0.08]) {
          const ph = (t * hz(n + d)) % 1;
          v += 2 * ph - 1;
        }
        lp[j] += lpCoef(1100) * (v - lp[j]);
        s += lp[j];
      });
      add(Math.round(barStart * SR) + k, s * 0.045 * pump * edge);
    }

    for (let q = 0; q < 8; q++) {
      const t0 = barStart + q * (beat / 2);
      const i0 = Math.round(t0 * SR);
      const onBeat = q % 2 === 0;

      if (onBeat) {
        // Kick
        let ph = 0;
        for (let k = 0; k < SR * 0.4; k++) {
          const t = k / SR;
          ph += (45 + 110 * Math.exp(-t / 0.03)) / SR;
          add(i0 + k, Math.sin(2 * Math.PI * ph) * Math.exp(-t / 0.22) * 0.9);
        }
        // Clap on 2 and 4
        if (q === 2 || q === 6) {
          let a = 0;
          let c = 0;
          for (let k = 0; k < SR * 0.25; k++) {
            const t = k / SR;
            const x = noise();
            a += lpCoef(2600) * (x - a);
            c += lpCoef(700) * (x - c);
            const flam = t < 0.02 ? (Math.floor(t / 0.007) % 2 === 0 ? 1 : 0.4) : 1;
            add(i0 + k, (a - c) * Math.exp(-t / 0.07) * 0.9 * flam);
          }
        }
      } else {
        // Off-beat closed hat
        let l = 0;
        for (let k = 0; k < SR * 0.08; k++) {
          const t = k / SR;
          const x = noise();
          l += lpCoef(7000) * (x - l);
          add(i0 + k, (x - l) * Math.exp(-t / 0.018) * 0.28);
        }
        // Off-beat bass
        const f = hz(chord.bass);
        for (let k = 0; k < SR * 0.24; k++) {
          const t = k / SR;
          const v = Math.tanh(2.2 * Math.sin(2 * Math.PI * f * t));
          add(i0 + k, v * Math.min(1, t / 0.005) * Math.exp(-t / 0.12) * 0.32);
        }
      }

      // Pluck arpeggio (8ths), an octave up
      const arp = [0, 1, 2, 1, 0, 2, 1, 2][q];
      const f = hz(chord.notes[arp] + 12);
      for (let k = 0; k < SR * 0.3; k++) {
        const t = k / SR;
        const v = Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(4 * Math.PI * f * t);
        add(i0 + k, v * Math.min(1, t / 0.003) * Math.exp(-t / 0.09) * 0.11);
      }
    }
  }
  save("music.wav", mix, 0.8);
}

/* ── sound effects ─────────────────────────────────────────────────────── */
{
  // Whoosh: noise through a sweeping low-pass.
  const len = Math.round(SR * 0.5);
  const buf = new Float32Array(len);
  let l = 0;
  let l2 = 0;
  for (let k = 0; k < len; k++) {
    const t = k / len;
    const fc = 250 + 5500 * Math.sin(Math.PI * Math.min(1, t * 1.15)) ** 2;
    const x = noise();
    l += lpCoef(fc) * (x - l);
    l2 += lpCoef(fc) * (l - l2);
    buf[k] = l2 * Math.sin(Math.PI * t) ** 1.5;
  }
  save("whoosh.wav", buf, 0.85);
}
{
  // Impact: sub drop + noise burst (hook opener).
  const len = Math.round(SR * 0.9);
  const buf = new Float32Array(len);
  let ph = 0;
  let l = 0;
  for (let k = 0; k < len; k++) {
    const t = k / SR;
    ph += (38 + 90 * Math.exp(-t / 0.06)) / SR;
    l += lpCoef(1800) * (noise() - l);
    buf[k] = Math.sin(2 * Math.PI * ph) * Math.exp(-t / 0.35) + l * Math.exp(-t / 0.05) * 1.6;
  }
  save("impact.wav", buf, 0.9);
}
{
  // Pop: quick pitched blip.
  const len = Math.round(SR * 0.14);
  const buf = new Float32Array(len);
  let ph = 0;
  for (let k = 0; k < len; k++) {
    const t = k / SR;
    ph += (420 + 700 * Math.exp(-t / 0.018)) / SR;
    buf[k] = Math.sin(2 * Math.PI * ph) * Math.min(1, t / 0.002) * Math.exp(-t / 0.035);
  }
  save("pop.wav", buf, 0.8);
}
{
  // Thud: stamp landing.
  const len = Math.round(SR * 0.5);
  const buf = new Float32Array(len);
  let ph = 0;
  let l = 0;
  for (let k = 0; k < len; k++) {
    const t = k / SR;
    ph += (50 + 120 * Math.exp(-t / 0.025)) / SR;
    l += lpCoef(1200) * (noise() - l);
    buf[k] = Math.sin(2 * Math.PI * ph) * Math.exp(-t / 0.14) + l * Math.exp(-t / 0.03) * 2;
  }
  save("thud.wav", buf, 0.9);
}
{
  // Ding: two-note bell for the CTA.
  const len = Math.round(SR * 1.6);
  const buf = new Float32Array(len);
  const partials: [number, number, number][] = [
    [1, 1, 0.9],
    [2, 0.5, 0.5],
    [2.76, 0.3, 0.35],
    [5.4, 0.12, 0.15],
  ];
  for (const [start, midi] of [
    [0, 88],
    [0.12, 95],
  ]) {
    const f = hz(midi);
    const s0 = Math.round(start * SR);
    for (let k = 0; s0 + k < len; k++) {
      const t = k / SR;
      let v = 0;
      for (const [r, a, d] of partials) v += a * Math.sin(2 * Math.PI * f * r * t) * Math.exp(-t / d);
      buf[s0 + k] += v * Math.min(1, t / 0.002);
    }
  }
  save("ding.wav", buf, 0.75);
}
console.log("✔ audio ready in public/audio");
