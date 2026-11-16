#!/usr/bin/env bash
# Build the delivery ZIP for the full 8:52 render (falls back to the Sample60
# clip when only the sample exists). Runs even when QC failed, so a failed
# render can still be inspected.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

OUT="bengali-finance-video-delivery.zip"
STAGE="$(mktemp -d)"
DELIVERY="$STAGE/delivery"

mkdir -p "$DELIVERY/source" "$DELIVERY/assets/user-images" "$DELIVERY/scripts"

# Rendered film (may be missing when the render step failed)
if [ -f out/full-video.mp4 ]; then
  cp out/full-video.mp4 "$DELIVERY/bengali-finance-video-8m52.mp4"
elif [ -f out/sample-60s.mp4 ]; then
  cp out/sample-60s.mp4 "$DELIVERY/sample-60s.mp4"
else
  echo "warning: no rendered MP4 — packaging sources only"
fi

# Remotion source project (includes full-video code and Sample60)
cp package.json tsconfig.json remotion.config.ts job_state.json "$DELIVERY/source/"
cp -r src public "$DELIVERY/source/"
# The 51 MB generated score is reproducible and should not bloat the ZIP.
rm -f "$DELIVERY/source/public/audio/score-full.wav"

# Original/derived assets
cp assets/voiceover-new.wav "$DELIVERY/assets/original-voiceover-8m52.wav"
cp assets/subtitles-new.srt "$DELIVERY/assets/original-subtitles-195-cues.srt"
cp public/audio/voiceover-sample.wav "$DELIVERY/assets/voiceover-sample-59s.wav"
cp public/audio/score-sample.wav "$DELIVERY/assets/score-sample-59s.wav"
cp -r assets/sfx "$DELIVERY/assets/sfx"
cp assets/OFL.txt "$DELIVERY/assets/OFL.txt"
mkdir -p "$DELIVERY/assets/characters"
cp public/images/rakib.png public/images/suman.png "$DELIVERY/assets/characters/"
if [ -n "$(ls -A assets/user-images 2>/dev/null)" ]; then
  cp -r assets/user-images/. "$DELIVERY/assets/user-images/"
fi

# Scripts and reports
cp scripts/generate_sfx.py scripts/generate_score.py scripts/cutout_characters.py scripts/build_story.py scripts/qc.py scripts/audit_text_fit.py scripts/package_delivery.sh "$DELIVERY/scripts/"
cp scene-plan.json manifest.json "$DELIVERY/"
cp README.md README_BN.md "$DELIVERY/"
[ -f QC_REPORT.md ] && cp QC_REPORT.md "$DELIVERY/"

# Preview stills are useful evidence of what was inspected
if [ -d out/preview ]; then
  mkdir -p "$DELIVERY/preview"
  cp out/preview/*.png "$DELIVERY/preview/" 2>/dev/null || true
fi

rm -f "$OUT"
(cd "$STAGE" && zip -qr "$ROOT/$OUT" delivery)
rm -rf "$STAGE"

echo "wrote $OUT ($(du -h "$OUT" | cut -f1))"
unzip -l "$OUT" | tail -4
