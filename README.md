# Bengali Finance Explainer — Pay Yourself First

Remotion project for an 8:52 Bengali 2D explainer built from the supplied
voiceover and 195-cue SRT. Frame: 1920×1080 (16:9), 30 fps, H.264 MP4 with AAC
audio. No subtitles are burned in; the SRT is used purely as timing reference.

## Requirements

- Node.js 20+
- FFmpeg/FFprobe
- A Chromium build (Remotion downloads its own headless shell)
- ~1.5 GB free disk for `node_modules` and the browser

The Android/Termux host used to author this project cannot render it: there is no
Chromium and not enough free space. Render on GitHub Actions or a desktop.

## Render

```bash
npm install
npx remotion render PayYourselfFirst out/final-video.mp4 --concurrency=4
```

Equivalent: `npm run render`.

## Render on GitHub Actions

Repository: `s31491771-cell/my-video`, branch `main`.

1. Push the project.
2. Open **Actions → Render Bengali Explainer → Run workflow**, branch `main`.
3. The job installs Node 20, type-checks, renders six preview stills, renders
   `out/final-video.mp4`, runs `scripts/qc.py`, builds
   `bengali-finance-video-delivery.zip`, and uploads everything as `render-N`.
   Tick `make_release` to attach the MP4 and ZIP to a GitHub Release.

## What is in the composition

| Piece | Detail |
|---|---|
| Composition ID | `PayYourselfFirst` |
| Duration | 15,959 frames = 531.967 s (source audio 531.96 s) |
| Audio | `public/audio/voiceover.wav`, original and unmodified |
| SFX | 164 cues, separate `<Audio>` elements placed by frame at gain 0.09–0.17 |
| Subtitles | none burned in; 195 SRT cues used only for timing |
| Font | Noto Sans Bengali variable TTF, bundled locally |
| Scenes | 75 vector scenes across 16 template types |
| Characters | rakib + suman flat vector avatars (swap with real art later) |

Scene timings live in `src/story.ts`; SFX constants in `src/timing.ts`. Every
animation delay is computed with `cueFrame(scene, cueId)`, so each line, number
and card lands on the syllable of the matching SRT cue. The SRT was verified
against measured speech: median offset +0.02 s, 188/195 cues within ±0.25 s.

## Rebuilding the timeline from the SRT

```bash
python3 scripts/build_story.py
```

Writes `src/cues.ts`, `src/story.ts`, `src/timing.ts` and `scene-plan.json`.

## Reproducing the SFX library

```bash
python3 -I scripts/generate_sfx.py public/audio/sfx
```

Deterministic, numpy only, no third-party audio.

## QC after rendering

Check: 1920×1080, 30 fps, H.264/yuv420p, AAC audio, 531.96 s ± 0.6 s, no black
frames at cuts, Bengali glyphs render correctly, SFX audible but clearly under
the voice, no burned-in subtitles. Results are written to `QC_REPORT.md`.
