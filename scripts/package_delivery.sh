#!/usr/bin/env bash
# Build the delivery ZIP described in the cloud-video-editor skill.
# Runs even when QC failed, so a failed render can still be inspected.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

OUT="bengali-finance-video-delivery.zip"
STAGE="$(mktemp -d)"
DELIVERY="$STAGE/delivery"

mkdir -p "$DELIVERY/source" "$DELIVERY/assets/user-images" "$DELIVERY/scripts"

# Final render (may be missing when the render step failed)
if [ -f out/final-video.mp4 ]; then
  cp out/final-video.mp4 "$DELIVERY/final-video.mp4"
else
  echo "warning: out/final-video.mp4 missing — packaging sources only"
fi

# Remotion source project
cp package.json tsconfig.json remotion.config.ts job_state.json "$DELIVERY/source/"
cp -r src public "$DELIVERY/source/"

# Original assets (never modified)
cp assets/original-voiceover.wav "$DELIVERY/assets/"
cp assets/original-subtitles.srt "$DELIVERY/assets/"
cp -r assets/sfx "$DELIVERY/assets/sfx"
cp assets/OFL.txt "$DELIVERY/assets/OFL.txt"
if [ -n "$(ls -A assets/user-images 2>/dev/null)" ]; then
  cp -r assets/user-images/. "$DELIVERY/assets/user-images/"
fi

# Scripts and reports
cp scripts/generate_sfx.py "$DELIVERY/scripts/"
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
