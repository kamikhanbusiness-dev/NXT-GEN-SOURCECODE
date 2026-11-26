import manifest from "./voice-manifest.json" with { type: "json" };
import { spoken, type Reel } from "./reels.ts";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Silence after each line before the cut, and extra hold on the end card. */
const GAP = 0.3;
const END_HOLD = 1.8;

type Segment = { text: string; voice: string; file: string; seconds: number; words?: number[] };
const voice = manifest as Record<string, { model: string; segments: Segment[] } | undefined>;

/** ~165 wpm — used for previews before the voiceover has been generated. */
const estimate = (text: string) => text.split(/\s+/).length / 2.75 + 0.2;

/** `wordFrames`: frame each spoken word starts (from whisper alignment), for word-accurate captions. */
export type SceneTiming = { from: number; frames: number; speechFrames: number; audio: string | null; wordFrames: number[] | null };

export function timeline(reel: Reel): { scenes: SceneTiming[]; total: number; hasVoice: boolean } {
  const segs = voice[reel.id]?.segments ?? [];
  let from = 0;
  let hasVoice = true;
  const scenes = reel.scenes.map((scene, i) => {
    const text = spoken(scene.voice);
    const seg = segs[i];
    const valid = seg && seg.text === text && seg.voice === reel.voice;
    if (!valid) hasVoice = false;
    const speech = valid ? seg.seconds : estimate(text);
    const tail = i === reel.scenes.length - 1 ? END_HOLD : GAP;
    const frames = Math.max(Math.round(1.4 * FPS), Math.ceil((speech + tail) * FPS));
    const wordFrames = valid && seg.words ? seg.words.map((w) => Math.round(w * FPS)) : null;
    const t = { from, frames, speechFrames: Math.ceil(speech * FPS), audio: valid ? seg.file : null, wordFrames };
    from += frames;
    return t;
  });
  return { scenes, total: from, hasVoice };
}
