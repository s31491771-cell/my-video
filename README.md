# Bengali Finance Explainer — Full 8:52 (Pay Yourself First)

Complete documentary-style Remotion film for the Bengali "Pay Yourself First"
explainer: **8 minutes 52 seconds**, 75 scenes, 195 narration cues. The look is
the bright editorial system approved in the 59.30 s `Sample60` cut: cream
paper, navy ink, flat-vector illustration, green/coral/blue accents, generous
whitespace, cue-locked reveals and hard cuts.

- Frame: **1920×1080 (16:9)**, **30 fps**, H.264 MP4 + AAC
- Duration: **15959 frames = 531.96 s (8:52)**
- Narration: original supplied voiceover, untouched (`public/audio/voiceover.wav`)
- Subtitles: **none burned in** — `assets/subtitles-new.srt` is the timing truth
- Visuals: 75 scenes across 17 bright templates; the two real character photos
  from the Download folder are used as background-removed sticker cutouts
  (রাকিব / সুমন); every on-screen line, number and card is bound to the exact
  SRT cue that speaks it, so the picture follows the voice sentence by sentence
- Audio: original voiceover + code-generated 8:52 score bed
  (`score-full.wav`, mixed at 0.12) + 165 planned SFX cues, all well under the
  voice

## Assets

| Asset | Path |
|---|---|
| Original voiceover (untouched) | `public/audio/voiceover.wav` |
| Full score bed (generated in CI) | `public/audio/score-full.wav` |
| 59.30 s sample voiceover | `public/audio/voiceover-sample.wav` |
| 59.30 s sample score | `public/audio/score-sample.wav` |
| SRT timing reference (195 cues) | `assets/subtitles-new.srt` |
| Character cutout: Rakib | `public/images/rakib.png` |
| Character cutout: Suman | `public/images/suman.png` |
| Font | `public/fonts/NotoSansBengali.ttf` |

Character cutouts were derived from the supplied Download images
`1794464679908.png` (Rakib) and `1794464682742.png` (Suman) with
`scripts/cutout_characters.py`. The originals were not modified.

## Project structure

```text
src/cues.ts             195 SRT cues (timing truth)
src/story.ts            75-scene timeline, per-scene data, cue mapping, 15959 frames
src/timing.ts           1920x1080 / 30 fps / 165 SFX cue positions
src/sample/             Approved 59.30 s bright-editorial sample (Sample60)
src/full/film.tsx       Full-film palettes, camera, chapter tags, typography, extra art
src/full/scenes.tsx     17 bright templates, 75-scene timeline, audio mix, FullVideo
src/Root.tsx            Registers FullVideo, PayYourselfFirst (alias), Sample60
scripts/generate_score.py     Reproducible score bed: sample or --full 8:52
scripts/audit_text_fit.py     75-scene Bengali text-fit audit (0 errors)
scripts/audit_sync.py         195-cue audio-visual sync audit (0 issues)
scripts/qc.py                 Configurable QC (duration, title, luma samples)
scripts/package_delivery.sh   Full-video delivery ZIP with sample fallback
```

## Render (GitHub Actions)

Repository: `s31491771-cell/my-video`, branch `main`.

Either push a tag matching `render-*` (for example `render-full-1`) or open
**Actions → Render Bengali Explainer → Run workflow** on `main`. The workflow:

1. installs Node, Python, ffmpeg/ffprobe and numpy/pillow;
2. generates `public/audio/score-full.wav` (531.96 s, peak −6 dBFS);
3. verifies assets, then runs the Bengali text-fit audit and the 195-cue
   audio-visual sync audit (every cue must have its own visual beat, no number
   may be spoken without being on screen);
4. renders 29 preview stills, then `out/full-video.mp4` (`FullVideo`);
5. runs QC (`--expected 531.96 --samples 24`), builds the delivery ZIP,
   uploads artifacts and creates a release when triggered by a tag.

## Render (desktop, if Chromium available)

```bash
npm install
python3 scripts/generate_score.py public/audio/score-full.wav --full
npx remotion render FullVideo out/full-video.mp4 --concurrency=4 --crf=18
```

## Delivery

`bengali-finance-video-8m52.mp4` (the film), preview stills, `QC_REPORT.md`,
the source project, original/derived assets and the scripts. The generated
51 MB `score-full.wav` is reproducible and excluded from the ZIP source copy.

## QC

`scripts/qc.py` checks 1920×1080, 30 fps, H.264, 531.96 s ± 0.53 s, AAC audio,
audible non-clipping levels, 24 sampled frames staying on bright paper, and no
black stretch longer than 0.5 s. It writes `QC_REPORT.md` and `qc.json`.
Perceptual checks (legibility, cutouts, SFX/score balance) need the preview
stills and a listening pass.

The QC verdict is mirrored to the `qc-reports` branch so it can be read without
signing in:

```
https://raw.githubusercontent.com/s31491771-cell/my-video/qc-reports/QC_REPORT.md
https://raw.githubusercontent.com/s31491771-cell/my-video/qc-reports/qc.json
```
