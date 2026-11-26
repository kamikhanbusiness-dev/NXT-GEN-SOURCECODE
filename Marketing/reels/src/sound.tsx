/**
 * Background music + sound effects. Files are synthesised by `npm run sfx`
 * (scripts/sfx.ts → public/audio). Cue frames match the springs in visuals.tsx.
 */
import { Html5Audio, Sequence, interpolate, staticFile } from "remotion";
import type { Visual } from "./reels.ts";
import type { SceneTiming } from "./timing.ts";

type Sfx = "whoosh" | "impact" | "pop" | "thud" | "ding";
type Cue = { at: number; sfx: Sfx; volume: number };

/** Swap for a licensed track (e.g. "audio/my-track.mp3") if you prefer. */
const MUSIC_FILE = "audio/music.wav";
const MUSIC_VOLUME = 0.6;
const MUSIC_DUCKED = 0.3; // while the voice is speaking

const pops = (start: number, step: number, n: number, volume = 0.45): Cue[] =>
  Array.from({ length: n }, (_, i) => ({ at: start + i * step, sfx: "pop", volume }));

/** Sound cues per visual, in frames from the start of the scene. */
function cuesFor(visual: Visual): Cue[] {
  switch (visual.kind) {
    case "stamp":
      return [{ at: 8, sfx: "thud", volume: 0.8 }];
    case "badges":
      return [{ at: 2, sfx: "pop", volume: 0.4 }, ...pops(11, 7, visual.items.length)];
    case "checklist":
      return pops(9, 7, visual.items.length);
    case "bars":
      return [{ at: 30, sfx: "pop", volume: 0.5 }];
    case "seasons":
      return [...pops(3, 8, 2, 0.35), { at: 25, sfx: "pop", volume: 0.45 }];
    case "sizeGauge":
      return [...pops(3, 9, 3, 0.3), { at: 36, sfx: "ding", volume: 0.25 }];
    case "certificate":
      return [{ at: 22, sfx: "pop", volume: 0.5 }];
    case "priceTags":
      return pops(5, 8, visual.items.length, 0.4);
    case "calendar":
      return visual.mode === "booked" ? [{ at: 34, sfx: "thud", volume: 0.8 }] : [{ at: 33, sfx: "ding", volume: 0.3 }];
    case "stars":
      return [...pops(7, 4, 5, 0.3), { at: 29, sfx: "pop", volume: 0.4 }];
    case "review":
      return pops(9, 4, 5, 0.22);
    case "cta":
      return [{ at: 10, sfx: "ding", volume: 0.45 }];
    case "multisplit":
      return pops(17, 5, 5, 0.3);
    default:
      return [];
  }
}

function Play({ at, sfx, volume }: Cue) {
  return (
    <Sequence from={at} layout="none">
      <Html5Audio src={staticFile(`audio/${sfx}.wav`)} volume={volume} />
    </Sequence>
  );
}

export function SoundTrack({ scenes, visuals, total, hookOffset }: { scenes: SceneTiming[]; visuals: Visual[]; total: number; hookOffset: number }) {
  // Duck the music under speech, with ~8-frame ramps.
  const music = (f: number) => {
    let dist = Infinity;
    for (const s of scenes) {
      const a = s.from;
      const b = s.from + s.speechFrames;
      dist = Math.min(dist, f < a ? a - f : f > b ? f - b : 0);
    }
    const v = interpolate(dist, [0, 8], [MUSIC_DUCKED, MUSIC_VOLUME], { extrapolateRight: "clamp" });
    const fadeOut = interpolate(f, [total - 30, total - 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return v * fadeOut;
  };

  return (
    <>
      <Html5Audio src={staticFile(MUSIC_FILE)} volume={music} loop />
      <Play at={0} sfx="impact" volume={0.7} />
      {scenes.slice(1).map((s, i) => (
        <Play key={`w${i}`} at={s.from - 7} sfx="whoosh" volume={0.45} />
      ))}
      {scenes.map((s, i) => (
        <Sequence key={i} from={s.from} layout="none">
          {cuesFor(visuals[i])
            // the hook scene's animation clock starts `hookOffset` frames in
            .map((c) => (i === 0 ? { ...c, at: c.at - hookOffset } : c))
            .filter((c) => c.at >= 0 && c.at < s.frames)
            .map((c, k) => (
              <Play key={k} {...c} />
            ))}
        </Sequence>
      ))}
    </>
  );
}
