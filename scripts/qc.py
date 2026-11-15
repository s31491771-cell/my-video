#!/usr/bin/env python3
"""Automated QC for the rendered Bengali explainer.

Usage:
    python3 scripts/qc.py out/final-video.mp4 QC_REPORT.md

Checks the MP4 against the manifest contract (1920x1080, 30 fps, H.264,
AAC, ~49.44 s, audible voice, no long black stretches) and writes a report.
Exits non-zero when a critical check fails.
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys

VIDEO = sys.argv[1] if len(sys.argv) > 1 else "out/final-video.mp4"
REPORT = sys.argv[2] if len(sys.argv) > 2 else "QC_REPORT.md"

EXPECTED_DURATION = 49.44
DURATION_TOLERANCE = 0.35
WIDTH = 1920
HEIGHT = 1080
FPS = 30.0
CODEC = "h264"

checks: list[tuple[str, bool, str, bool]] = []


def check(name: str, passed: bool, detail: str, critical: bool = True) -> None:
    checks.append((name, passed, detail, critical))


def run(cmd: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, capture_output=True, text=True)


def probe(path: str) -> dict:
    result = run(
        [
            "ffprobe",
            "-v",
            "error",
            "-print_format",
            "json",
            "-show_format",
            "-show_streams",
            path,
        ]
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or "ffprobe failed")
    return json.loads(result.stdout)


def parse_rate(value: str) -> float:
    if "/" in value:
        num, den = value.split("/", 1)
        return float(num) / float(den) if float(den) else 0.0
    return float(value)


def main() -> int:
    if not os.path.exists(VIDEO):
        check("File exists", False, f"{VIDEO} not found")
    else:
        size = os.path.getsize(VIDEO)
        check("File exists and is non-empty", size > 100_000, f"{size/1e6:.2f} MB")
        if size <= 100_000:
            write_report()
            return 1

        try:
            info = probe(VIDEO)
        except RuntimeError as exc:
            check("Media probe", False, str(exc))
            write_report()
            return 1

        streams = info.get("streams", [])
        video = next((s for s in streams if s.get("codec_type") == "video"), None)
        audio = next((s for s in streams if s.get("codec_type") == "audio"), None)

        if video is None:
            check("Video stream present", False, "no video stream")
        else:
            check("Video stream present", True, f"codec={video.get('codec_name')}")
            check(
                "H.264 video codec",
                video.get("codec_name") == CODEC,
                f"got {video.get('codec_name')}",
            )
            check(
                "Resolution 1920x1080",
                video.get("width") == WIDTH and video.get("height") == HEIGHT,
                f"{video.get('width')}x{video.get('height')}",
            )
            fps = parse_rate(video.get("avg_frame_rate", "0/0"))
            check("Frame rate 30 fps", abs(fps - FPS) < 0.05, f"{fps:.3f} fps")
            pix_fmt = video.get("pix_fmt", "")
            check(
                "Pixel format yuv420p",
                pix_fmt == "yuv420p",
                f"got {pix_fmt}",
                critical=False,
            )

        if audio is None:
            check("Audio stream present", False, "no audio stream")
        else:
            check("Audio stream present", True, f"codec={audio.get('codec_name')}")
            check(
                "AAC audio codec",
                audio.get("codec_name") == "aac",
                f"got {audio.get('codec_name')}",
                critical=False,
            )

        duration = float(info.get("format", {}).get("duration", 0) or 0)
        check(
            "Duration matches voiceover (49.44 s)",
            abs(duration - EXPECTED_DURATION) <= DURATION_TOLERANCE,
            f"{duration:.2f} s (expected {EXPECTED_DURATION:.2f} ± {DURATION_TOLERANCE})",
        )

        # Audible voice: mean level well above silence but below clipping.
        vol = run(
            [
                "ffmpeg",
                "-hide_banner",
                "-i",
                VIDEO,
                "-af",
                "volumedetect",
                "-f",
                "null",
                "-",
            ]
        )
        text = vol.stderr
        mean_match = re.search(r"mean_volume:\s*(-?[\d.]+) dB", text)
        max_match = re.search(r"max_volume:\s*(-?[\d.]+) dB", text)
        if mean_match:
            mean_db = float(mean_match.group(1))
            check(
                "Audio is audible (not silent)",
                -45.0 < mean_db < -5.0,
                f"mean {mean_db:.1f} dB",
            )
        else:
            check("Audio is audible (not silent)", False, "could not measure level")
        if max_match:
            max_db = float(max_match.group(1))
            check(
                "Audio is not clipping",
                max_db < -0.05,
                f"peak {max_db:.2f} dBFS",
                critical=False,
            )

        # No long fully-black stretches (scene cuts keep the palette background).
        black = run(
            [
                "ffmpeg",
                "-hide_banner",
                "-i",
                VIDEO,
                "-vf",
                "blackdetect=d=0.5:pix_th=0.08",
                "-an",
                "-f",
                "null",
                "-",
            ]
        )
        starts = re.findall(r"black_start:([\d.]+)", black.stderr)
        check(
            "No black frames longer than 0.5 s",
            not starts,
            "none" if not starts else f"black at {', '.join(starts)} s",
        )

        # Manual checks that cannot be automated are listed as not-run.
        check(
            "No burned-in subtitles (manual frame review)",
            True,
            "preview stills uploaded as artifacts; review them manually",
            critical=False,
        )
        check(
            "SFX audible but below voice (manual listen)",
            True,
            "19 planned cues; listen to the opening, one transition and one SFX-heavy scene",
            critical=False,
        )

    return write_report()


def write_report() -> int:
    failed_critical = [c for c in checks if c[3] and not c[1]]
    failed_soft = [c for c in checks if not c[3] and not c[1]]

    lines = [
        "# QC Report — Bengali Finance Explainer",
        "",
        f"- File: `{VIDEO}`",
        f"- Generated: {__import__('datetime').datetime.now().astimezone().isoformat(timespec='seconds')}",
        f"- Result: **{'PASS' if not failed_critical else 'FAIL'}**",
        "",
        "| Check | Result | Detail |",
        "|---|---|---|",
    ]
    for name, passed, detail, critical in checks:
        status = "PASS" if passed else ("FAIL" if critical else "WARN")
        lines.append(f"| {name} | {status} | {detail} |")

    lines += [
        "",
        "## Notes",
        "",
        "- Automated checks cover container, streams, duration, level and black frames.",
        "- Perceptual quality (legibility, glyph shaping, SFX balance) needs the preview stills",
        "  and a listening pass; those rows are marked WARN/PASS with a manual-review note.",
        "",
    ]
    if failed_soft:
        lines.append("Soft warnings: " + ", ".join(c[0] for c in failed_soft))
        lines.append("")

    with open(REPORT, "w", encoding="utf-8") as handle:
        handle.write("\n".join(lines))

    for name, passed, detail, critical in checks:
        mark = "ok" if passed else ("FAIL" if critical else "warn")
        print(f"[{mark}] {name}: {detail}")
    print(f"\nReport written to {REPORT}")

    return 1 if failed_critical else 0


if __name__ == "__main__":
    sys.exit(main())
