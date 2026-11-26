/**
 * Renders every reel to out/<seo-slug>.mp4 (1080×1920, H.264, AAC).
 *
 *   npm run render                 # all reels
 *   npm run render -- Reel3        # reels whose id contains "Reel3"
 *   npm run render -- --stills     # one PNG per scene to out/stills (quick visual check)
 */
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { reels } from "../src/reels.ts";
import { timeline } from "../src/timing.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const stills = args.includes("--stills");
const filter = args.find((a) => !a.startsWith("--"));

console.log("Bundling…");
const serveUrl = await bundle({ entryPoint: join(root, "src/index.ts") });
mkdirSync(join(root, "out/stills"), { recursive: true });

for (const reel of reels) {
  if (filter && !reel.id.includes(filter)) continue;
  const { scenes, total, hasVoice } = timeline(reel);
  const composition = await selectComposition({ serveUrl, id: reel.id, inputProps: { reel } });

  if (stills) {
    for (const [i, s] of scenes.entries()) {
      const frame = i === 0 ? 0 : s.from + Math.min(24, s.frames - 1);
      const output = join(root, `out/stills/${reel.id}-${i}.png`);
      await renderStill({ serveUrl, composition, frame, output, inputProps: { reel } });
    }
    console.log(`✔ ${reel.id} stills`);
    continue;
  }

  if (!hasVoice) console.warn(`⚠ ${reel.id}: no matching voiceover — rendering SILENT preview. Run \`npm run voice\` first.`);
  const output = join(root, `out/${reel.slug}${hasVoice ? "" : "-SILENT-PREVIEW"}.mp4`);
  await renderMedia({
    serveUrl,
    composition,
    codec: "h264",
    crf: 18,
    audioCodec: "aac",
    audioBitrate: "192k",
    imageFormat: "jpeg",
    jpegQuality: 92,
    outputLocation: output,
    inputProps: { reel },
    onProgress: ({ progress }) => process.stdout.write(`\r  ${reel.id} ${(progress * 100).toFixed(0)}%   `),
  });
  console.log(`\n✔ ${output.replace(root + "/", "")}  (${(total / 30).toFixed(1)}s)`);
}
