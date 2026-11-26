import { AbsoluteFill, Html5Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Background, Captions, CutFlash, LogoPill, Progress, Title } from "./components/chrome.tsx";
import { VisualView } from "./components/visuals.tsx";
import type { Reel as ReelData, Scene } from "./reels.ts";
import { SoundTrack } from "./sound.tsx";
import { timeline } from "./timing.ts";

const HOOK_OFFSET = 40;

function SceneView({ scene, frames, speechFrames, wordFrames, id, index }: { scene: Scene; frames: number; speechFrames: number; wordFrames: number[] | null; id: string; index: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Punch-in on the cut, then a slow push for constant motion. Opacity is never 0.
  const punch = spring({ frame, fps, config: { damping: 14, stiffness: 180 } });
  const push = interpolate(frame, [0, frames], [1, 1.05]);
  const top = scene.title ? 590 : scene.visual.kind === "cta" ? 250 : 280;
  const height = 1300 - top;
  return (
    <AbsoluteFill>
      <Background theme={scene.theme} seed={`${id}-${index}`} />
      <AbsoluteFill style={{ transform: `scale(${(1.12 - punch * 0.12) * push})` }}>
        {/* The hook scene starts fully built (offset clock): frame 0 is the thumbnail and the scroll-stopper. */}
        <Sequence from={index === 0 ? -HOOK_OFFSET : 0} layout="none">
          {scene.title && <Title text={scene.title} theme={scene.theme} />}
          <div style={{ position: "absolute", top, left: 0, right: 0, height, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <VisualView visual={scene.visual} theme={scene.theme} dur={frames + (index === 0 ? HOOK_OFFSET : 0)} />
          </div>
        </Sequence>
      </AbsoluteFill>
      <Captions text={scene.voice} speechFrames={speechFrames} wordFrames={wordFrames} />
      {index > 0 && <CutFlash />}
    </AbsoluteFill>
  );
}

export function Reel({ reel }: { reel: ReelData }) {
  const { scenes, total } = timeline(reel);
  return (
    <AbsoluteFill style={{ background: "#070b18" }}>
      {reel.scenes.map((scene, i) => {
        const t = scenes[i];
        return (
          <Sequence key={i} from={t.from} durationInFrames={t.frames} name={`${i + 1}. ${scene.voice.slice(0, 40)}`}>
            <SceneView scene={scene} frames={t.frames} speechFrames={t.speechFrames} wordFrames={t.wordFrames} id={reel.id} index={i} />
            {t.audio && <Html5Audio src={staticFile(t.audio)} />}
          </Sequence>
        );
      })}
      <LogoPill />
      <Progress starts={scenes.map((s) => s.from)} total={total} />
      <SoundTrack scenes={scenes} visuals={reel.scenes.map((s) => s.visual)} total={total} hookOffset={HOOK_OFFSET} />
    </AbsoluteFill>
  );
}
