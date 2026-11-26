import { Composition } from "remotion";
import { Reel } from "./Reel.tsx";
import { reels } from "./reels.ts";
import { FPS, HEIGHT, WIDTH, timeline } from "./timing.ts";

export function Root() {
  return (
    <>
      {reels.map((reel) => (
        <Composition
          key={reel.id}
          id={reel.id}
          component={Reel}
          defaultProps={{ reel }}
          durationInFrames={timeline(reel).total}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
      ))}
    </>
  );
}
