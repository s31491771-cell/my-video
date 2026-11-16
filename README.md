# Bengali Finance Explainer — Sample 60 Seconds (Pay Yourself First)

Documentary-style Remotion sample for the first **59.30 seconds** of the Bengali
"Pay Yourself First" explainer. This stage renders `Sample60` only (11 scenes,
cues 1–22) instead of the full 8:52 video. The look follows the supplied
reference clip: bright cream paper, navy ink, flat-vector editorial
illustration, green/coral/blue accents, generous whitespace and hard cuts.

- Frame: **1920×1080 (16:9)**, **30 fps**, H.264 MP4 + AAC
- Duration: **1779 frames = 59.30 s** (ends at SRT cue 23 start to avoid a mid-sentence cut)
- Subtitles: **none burned in** (SRT is timing reference only)
- Visuals: real character photos as sticker-style cutouts over flat colour
  blobs, cream paper backdrop with dot grid, white cards, flat vector Dhaka
  rooftops, bar charts, progress ring and a phone/app mockup; every text and
  chart beat is cue-locked to the narration
- Audio: trimmed voiceover (`voiceover-sample.wav`) + quiet bright score bed
  (`score-sample.wav`, mixed ~0.12) + 33 SFX cues from the bundled SFX library

## Assets

| Asset | Path |
|---|---|
| Original voiceover (untouched) | `public/audio/voiceover.wav` |
| Sample voiceover (59.30 s) | `public/audio/voiceover-sample.wav` |
| Sample score bed | `public/audio/score-sample.wav` |
| SRT timing reference | `assets/subtitles-new.srt` |
| Character cutout: Rakib | `public/images/rakib.png` |
| Character cutout: Suman | `public/images/suman.png` |
| Font | `public/fonts/NotoSansBengali.ttf` |

Character cutouts were derived from the supplied Download images
`1794464679908.png` (Rakib) and `1794464682742.png` (Suman) using
`scripts/cutout_characters.py`. Original images were not modified.

## Project structure (sample)

```text
src/sample/plan.ts      11-scene timeline, cue mapping, camera moves (1779 frames)
src/sample/film.tsx     Bright editorial system (paper, cards, charts, phone mockup, sticker portraits)
src/sample/scenes.tsx   P01–P11 scenes, audio mix (voice + score + SFX), Sample60 composition
src/Root.tsx            Registers Sample60 (and keeps legacy PayYourselfFirst)
scripts/cutout_characters.py  Reproducible background removal for the two photos
scripts/generate_score.py     Reproducible 59.3 s bright editorial score bed
scripts/qc.py                 QC for out/sample-60s.mp4 (59.30 s ± 0.35 s)
```

## Render (GitHub Actions)

Repository: `s31491771-cell/my-video`, branch `main`.

1. Push the project.
2. Open **Actions → Render Bengali Explainer → Run workflow**, branch `main`.
3. The workflow verifies assets, renders preview stills, renders
   `out/sample-60s.mp4` (`Sample60`), runs QC, builds the delivery ZIP, and
   uploads artifacts.

## Render (desktop, if Chromium available)

```bash
npm install
npx remotion render Sample60 out/sample-60s.mp4 --concurrency=4
```

## QC

`scripts/qc.py` checks: 1920×1080, 30 fps, H.264, 59.30 s ± 0.35 s, audible
non-clipping audio, bright paper luma, no long black frames. Perceptual checks
(legibility, cutouts, SFX/score balance) require reviewing preview stills and
listening.
