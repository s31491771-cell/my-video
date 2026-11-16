#!/usr/bin/env python3
"""Verify in the rendered film that every narration cue gets a visual beat.

The film is decoded to small grayscale frames at 5 fps and compared frame by
frame. Every SRT cue must be followed by a visible change inside a short
window, which proves that the picture reacts while the sentence is being
spoken (no silent stretches where the voice talks over a frozen screen).

The metric is the share of pixels that changed clearly between two frames
(grey level difference above 24), which reacts to a text line or a chip
appearing while ignoring encoder noise.

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
# Share of pixels that must change for a cue to count as "it has a beat".
CHANGED_THRESHOLD = 0.001  # 0.1 %
# Grey level difference that counts as a pixel change.
PIXEL_DELTA = 24
# How long after the cue a change may still count as "its" beat.
WINDOW_BEFORE = 0.4
WINDOW_AFTER = 1.8


def cue_starts() -> list[tuple[int, float]]:
    raw = open("src/cues.ts", encoding="utf-8").read()
    out = []
    for match in re.finditer(r'\{id: (\d+), start: ([\d.]+),', raw):
        out.append((int(match.group(1)), float(match.group(2))))
    return out


def frame_changes(video: str) -> list[float]:
    """Share of clearly changed pixels between consecutive sampled frames."""
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

        frames = np.frombuffer(data[: count * size], dtype=np.uint8).reshape(count, size).astype(np.int16)
        diff = np.abs(frames[1:] - frames[:-1])
        return [float(value) for value in (diff > PIXEL_DELTA).mean(axis=1)]
    except ImportError:
        previous = data[:size]
        out = []
        for index in range(1, count):
            current = data[index * size : (index + 1) * size]
            changed = sum(1 for a, b in zip(previous, current) if abs(a - b) > PIXEL_DELTA)
            out.append(changed / size)
            previous = current
        return out


def main() -> int:
    changes = frame_changes(VIDEO)
    peaks = [max(changes[max(0, i - 2) : i + 3]) for i in range(len(changes))]
    cues = cue_starts()
    missing = []
    for cue_id, start in cues:
        lo = max(0, int((start - WINDOW_BEFORE) * FPS))
        hi = min(len(peaks) - 1, int((start + WINDOW_AFTER) * FPS))
        best = max(peaks[lo : hi + 1]) if hi >= lo else 0.0
        if best < CHANGED_THRESHOLD:
            missing.append((cue_id, start, best))
    print(f"frames sampled: {len(changes)} at {FPS:g} fps")
    print(f"median changed share between frames: {sorted(changes)[len(changes) // 2] * 100:.2f} %")
    print(f"max changed share between frames: {max(changes) * 100:.2f} %")
    print(f"cues checked: {len(cues)}")
    if missing:
        print(f"\ncues WITHOUT a visual beat ({len(missing)}):")
        for cue_id, start, best in missing:
            print(f"  cue{cue_id} @{start:7.2f}s  best change {best * 100:.3f} %")
        return 1
    print(f"\nall {len(cues)} cues have a visible change within {WINDOW_AFTER:.1f} s of their start")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
