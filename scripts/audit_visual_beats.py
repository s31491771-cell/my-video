#!/usr/bin/env python3
"""Verify in the rendered film that every narration cue gets a visual beat.

The film is decoded to small grayscale frames at 5 fps and the mean absolute
difference between consecutive frames is measured. Every SRT cue must be
followed by a visible change inside a short window, which proves that the
picture reacts while the sentence is being spoken (no silent stretches where
the voice talks over a frozen screen).

Usage:
    python3 scripts/audit_visual_beats.py out/full-video.mp4
"""
from __future__ import annotations

import re
import subprocess
import sys

VIDEO = sys.argv[1] if len(sys.argv) > 1 else "out/full-video.mp4"
FPS = 5.0
WIDTH, HEIGHT = 480, 270
# Mean grey-level difference that counts as "something moved on screen".
THRESHOLD = 1.0
# How long after the cue a change may still count as "its" beat.
WINDOW_BEFORE = 0.4
WINDOW_AFTER = 1.8


def cue_starts() -> list[tuple[int, float]]:
    raw = open("src/cues.ts", encoding="utf-8").read()
    out = []
    for match in re.finditer(r'\{id: (\d+), start: ([\d.]+),', raw):
        out.append((int(match.group(1)), float(match.group(2))))
    return out


def frame_diffs(video: str) -> list[float]:
    raw = subprocess.run(
        [
            "ffmpeg",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            video,
            "-vf",
            f"fps={FPS},scale={WIDTH}:{HEIGHT},format=gray",
            "-f",
            "rawvideo",
            "-",
        ],
        capture_output=True,
        check=False,
    )
    data = raw.stdout
    size = WIDTH * HEIGHT
    count = len(data) // size
    if count < 2:
        raise SystemExit("could not read frames from the render")
    try:
        import numpy as np

        frames = np.frombuffer(data[: count * size], dtype=np.uint8).reshape(count, size)
        diffs = np.abs(frames[1:].astype(np.int16) - frames[:-1].astype(np.int16)).mean(axis=1)
        return [float(value) for value in diffs]
    except ImportError:
        previous = data[:size]
        diffs = []
        for index in range(1, count):
            current = data[index * size : (index + 1) * size]
            total = 0
            for a, b in zip(previous, current):
                total += a - b if a > b else b - a
            diffs.append(total / size)
            previous = current
        return diffs


def main() -> int:
    diffs = frame_diffs(VIDEO)
    peaks = [max(diffs[max(0, i - 2) : i + 3]) for i in range(len(diffs))]
    cues = cue_starts()
    missing = []
    for cue_id, start in cues:
        lo = max(0, int((start - WINDOW_BEFORE) * FPS))
        hi = min(len(peaks) - 1, int((start + WINDOW_AFTER) * FPS))
        best = max(peaks[lo : hi + 1]) if hi >= lo else 0.0
        if best < THRESHOLD:
            missing.append((cue_id, start, best))
    print(f"frames sampled: {len(diffs)} at {FPS:g} fps")
    print(f"mean change between frames: {sum(diffs) / len(diffs):.2f} grey levels")
    print(f"max change between frames: {max(diffs):.2f} grey levels")
    print(f"cues checked: {len(cues)}")
    if missing:
        print(f"\ncues WITHOUT a visual beat ({len(missing)}):")
        for cue_id, start, best in missing:
            print(f"  cue{cue_id} @{start:7.2f}s  best change {best:.2f}")
        return 1
    print("\nall cues have a visible change within 1.8 s of their start")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
