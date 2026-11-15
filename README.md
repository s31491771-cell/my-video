# Bengali Finance Explainer — Pay Yourself First

Remotion project for a 49.44 s Bengali 2D explainer built from the supplied
voiceover and SRT. Frame: 1920×1080 (16:9), 30 fps, H.264 MP4 with AAC audio.

## Requirements

- Node.js 20+
- FFmpeg/FFprobe
- A Chromium build (Remotion downloads its own headless shell)
- ~1.5 GB free disk for `node_modules` and the browser

The Android/Termux host used to author this project cannot render it: there is no
Chromium and not enough free space. Render on a cloud worker or desktop.

## Render

```bash
npm install
npx remotion render PayYourselfFirst out/final-video.mp4
```

Equivalent: `npm run render`.

Background render (recommended for long jobs):

```bash
npx remotion render PayYourselfFirst out/final-video.mp4 --concurrency=4 --log=verbose
```

## Render on GitHub Actions

No local machine needed. Push this folder to a GitHub repository, then open
**Actions → Render Bengali Explainer → Run workflow**. The workflow:

1. installs Node 20 and npm dependencies,
2. renders six preview stills,
3. renders `out/final-video.mp4`,
4. runs `scripts/qc.py` (fails the job on critical QC errors),
5. packages `bengali-finance-video-delivery.zip`,
6. uploads everything as the `render-N` artifact, and optionally creates a
   GitHub Release when "make_release" is checked.

Command line equivalent:

```bash
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

Pushing a tag that starts with `render-` also triggers the workflow.

## What is in the composition

| Piece | Detail |
|---|---|
| Composition ID | `PayYourselfFirst` |
| Duration | 1484 frames = 49.467 s (source audio 49.44 s) |
| Audio | `public/audio/voiceover.wav`, original and unmodified |
| SFX | 19 cues, separate `<Audio>` elements placed by frame |
| Subtitles | none burned in; SRT used only for timing |
| Font | Noto Sans Bengali variable TTF, bundled locally |
| Scenes | 10 vector scenes, no stock or generated imagery |

Scene timings and SFX placements are declared once in `src/timing.ts` and
mirrored in `scene-plan.json`.

## Reproducing the SFX library

```bash
python3 -I scripts/generate_sfx.py public/audio/sfx
```

Deterministic, numpy only, no third-party audio.

## QC after rendering

Check: 1920×1080, 30 fps, H.264/yuv420p, AAC audio, ~49.44 s duration, no black
frames at cuts, Bengali glyphs render correctly, SFX audible but clearly under the
voice, no burned-in subtitles. Record results in `QC_REPORT.md` before delivery.
