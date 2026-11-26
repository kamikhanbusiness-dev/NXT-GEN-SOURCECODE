# NXTGEN promo reels

Five animated 9:16 reels built with [Remotion](https://remotion.dev) (React → MP4), with a voiceover from Gemini Flash TTS. Brand facts, prices and reviews are read live from the website (`../src/config/site.ts`, `../src/content/index.ts`), so update them there.

```bash
cd reels
npm install
npm run setup:whisper         # one-off: builds whisper.cpp + base.en model (local, used for alignment)
npm run sfx                   # one-off: generates the music loop + sound effects
cp .env.example .env          # add GEMINI_API_KEY (https://aistudio.google.com/apikey)
npm run build:all             # = npm run voice && npm run render  → out/*.mp4
```

| Command | What it does |
| --- | --- |
| `npm run studio` | Live preview/editor in the browser |
| `npm run voice` | One Gemini TTS request per reel → raw take in `takes/`, then a local whisper.cpp alignment splits it into one clip per scene (`public/voice/`) and records word timings for the captions (`src/voice-manifest.json`). Unchanged reels are skipped; `-- --force` regenerates |
| `npm run render` | Renders all reels to `out/<seo-slug>.mp4`. Without voiceover it writes `…-SILENT-PREVIEW.mp4` |
| `npm run render -- Reel2` | Renders one reel |
| `npm run render -- --stills` | One PNG per scene in `out/stills` for a quick check |

- **Edit scripts** in `src/reels.ts`: one entry per scene (`voice`, optional `title`, `theme`, `visual`). `*asterisks*` highlight words on screen. Scene lengths follow the audio automatically.
- **TTS model:** tries `gemini-3.8-flash-tts`, then `gemini-3.1-flash-tts-preview`, then older models, moving on automatically when a model's daily free-tier quota (10 requests) is used up. Override with `GEMINI_TTS_MODEL`.
- **Direction prompt:** keep `STYLE` in `scripts/voice.ts` to one short "Say …" clause. Longer instructions get read aloud (the script detects this and stops).
- **Music & sound effects:** `npm run sfx` synthesises an original, royalty-free 120 BPM loop plus whoosh/impact/pop/thud/ding effects into `public/audio/`. The music ducks under the voice automatically. Levels and per-visual cues live in `src/sound.tsx`; set `MUSIC_FILE` there to use a licensed track instead.
- **Accent:** the voice is directed to a local Nottingham / East Midlands accent (`STYLE` in `scripts/voice.ts`). If the model reads the direction aloud, the alignment step trims it off automatically.
- **Captions, hashtags, titles and posting plan:** see [POSTING-KIT.md](POSTING-KIT.md).
