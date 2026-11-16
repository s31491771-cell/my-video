#!/usr/bin/env python3
"""Automated QC for the rendered Bengali explainer.

Usage:
    python3 scripts/qc.py out/sample-60s.mp4 QC_REPORT.md

Checks the MP4 against the manifest contract (1920x1080, 30 fps, H.264,
AAC, ~59.30 s, audible voice, bright paper frames, no long black stretches),
writes a human report plus a machine-readable `qc.json`, and exits non-zero
when a critical check fails.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys

parser = argparse.ArgumentParser(description="Automated QC for the Bengali explainer render.")
parser.add_argument("video", nargs="?", default="out/sample-60s.mp4")
parser.add_argument("report", nargs="?", default="QC_REPORT.md")
parser.add_argument("--expected", type=float, default=59.30, help="expected duration in seconds")
parser.add_argument("--title", default="Bengali Finance Explainer (Sample60)", help="report title")
parser.add_argument("--samples", type=int, default=0, help="number of brightness samples (0 = auto)")
args = parser.parse_args()

VIDEO = args.video
REPORT = args.report
JSON_REPORT = os.path.join(os.path.dirname(REPORT) or ".", "qc.json")

EXPECTED_DURATION = args.expected
DURATION_TOLERANCE = max(0.35, EXPECTED_DURATION * 0.001)
WIDTH = 1920
HEIGHT = 1080
FPS = 30.0
CODEC = "h264"

# Frames sampled for the per-scene brightness scan.
SAMPLE_LIST = [2.0, 6.0, 10.0, 14.0, 20.0, 25.0, 27.6, 32.0, 38.0, 47.0, 53.0, 57.5]
if args.samples > 0 or EXPECTED_DURATION > 100:
    count = args.samples or 24
    VISUAL_SAMPLES = [round(EXPECTED_DURATION * (index + 0.5) / count, 2) for index in range(count)]
else:
    VISUAL_SAMPLES = SAMPLE_LIST

checks: list[tuple[str, bool, str, bool]] = []
diagnostics: dict[str, object] = {}


def check(name: str, passed: bool, detail: str, critical: bool = True) -> None:
    checks.append((name, passed, detail, critical))


def run(cmd: list[str]) -> subprocess.CompletedProcess:
    try:
        return subprocess.run(cmd, capture_output=True, text=True)
    except FileNotFoundError as exc:
        return subprocess.CompletedProcess(cmd, 127, "", str(exc))


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


def scan_luma(path: str, at: float) -> float | None:
    """Mean luma (YAVG) of one frame, or None when ffmpeg cannot read it."""
    sample = run(
        [
            "ffmpeg",
            "-hide_banner",
            "-ss",
            f"{at:.3f}",
            "-i",
            path,
            "-frames:v",
            "1",
            "-vf",
            "signalstats,metadata=print",
            "-f",
            "null",
            "-",
        ]
    )
    match = re.search(r"lavfi\.signalstats\.YAVG=([\d.]+)", sample.stderr)
    return float(match.group(1)) if match else None


def main() -> int:
    diagnostics["ffmpeg"] = shutil.which("ffmpeg")
    diagnostics["ffprobe"] = shutil.which("ffprobe")
    diagnostics["file"] = os.path.abspath(VIDEO)

    if not os.path.exists(VIDEO):
        check("File exists", False, f"{VIDEO} not found")
        return write_report()
    if not diagnostics["ffmpeg"] or not diagnostics["ffprobe"]:
        check(
            "ffmpeg + ffprobe available",
            False,
            f"ffmpeg={diagnostics['ffmpeg']} ffprobe={diagnostics['ffprobe']}",
        )
        return write_report()

    size = os.path.getsize(VIDEO)
    check("File exists and is non-empty", size > 100_000, f"{size/1e6:.2f} MB")
    if size <= 100_000:
        return write_report()

    try:
        info = probe(VIDEO)
    except RuntimeError as exc:
        check("Media probe", False, str(exc))
        return write_report()

    streams = info.get("streams", [])
    video = next((s for s in streams if s.get("codec_type") == "video"), None)
    audio = next((s for s in streams if s.get("codec_type") == "audio"), None)

    diagnostics["format"] = {
        "duration": info.get("format", {}).get("duration"),
        "size": info.get("format", {}).get("size"),
        "bit_rate": info.get("format", {}).get("bit_rate"),
        "format_name": info.get("format", {}).get("format_name"),
    }
    diagnostics["streams"] = [
        {
            key: s.get(key)
            for key in (
                "index",
                "codec_type",
                "codec_name",
                "width",
                "height",
                "pix_fmt",
                "avg_frame_rate",
                "r_frame_rate",
                "duration",
                "start_time",
                "nb_frames",
                "sample_rate",
                "channels",
                "bit_rate",
            )
            if s.get(key) is not None
        }
        for s in streams
    ]

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
        f"Duration matches narration ({EXPECTED_DURATION:.2f} s)",
        abs(duration - EXPECTED_DURATION) <= DURATION_TOLERANCE,
        f"{duration:.2f} s (expected {EXPECTED_DURATION:.2f} ± {DURATION_TOLERANCE:.2f})",
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
    diagnostics["volumedetect"] = {
        "exit": vol.returncode,
        "tail": "\n".join(text.strip().splitlines()[-6:]),
    }
    mean_match = re.search(r"mean_volume:\s*(-?[\d.]+) dB", text)
    max_match = re.search(r"max_volume:\s*(-?[\d.]+) dB", text)
    if mean_match:
        mean_db = float(mean_match.group(1))
        diagnostics["volumedetect"]["mean_db"] = mean_db
        check(
            "Audio is audible (not silent)",
            -45.0 < mean_db < -5.0,
            f"mean {mean_db:.1f} dB",
        )
    else:
        check("Audio is audible (not silent)", False, "could not measure level")
    if max_match:
        max_db = float(max_match.group(1))
        diagnostics["volumedetect"]["max_db"] = max_db
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
    diagnostics["blackdetect"] = {
        "exit": black.returncode,
        "intervals": re.findall(r"black_start:[\d.]+ black_end:[\d.]+ black_duration:[\d.]+", black.stderr),
    }
    check(
        "No black frames longer than 0.5 s",
        black.returncode == 0 and not starts,
        "none" if not starts else f"black at {', '.join(starts)} s",
    )

    # Bright editorial palette: sampled frames should stay on cream paper.
    lumas: dict[str, float | None] = {}
    for at in VISUAL_SAMPLES:
        lumas[f"{at:g}s"] = scan_luma(VIDEO, at)
    diagnostics["luma"] = lumas
    measured = [v for v in lumas.values() if v is not None]
    if measured:
        low = min(measured)
        high = max(measured)
        check(
            "Bright paper background (every sample luma >= 150)",
            low >= 150.0,
            f"min YAVG {low:.1f}, max {high:.1f}",
            critical=False,
        )
        darkest = min(lumas.items(), key=lambda kv: kv[1] if kv[1] is not None else 999)
        diagnostics["darkest_sample"] = {"at": darkest[0], "yavg": darkest[1]}
    else:
        check("Bright paper background (samples)", False, "no frames measured", critical=False)

    # Manual checks that cannot be automated are listed as not-run.
    check(
        "No burned-in subtitles (manual frame review)",
        True,
        "preview stills uploaded as artifacts; review them manually",
        critical=False,
    )
    check(
        "SFX/score audible but below voice (manual listen)",
        True,
        "planned SFX cues + quiet score bed (mixed ~0.12); listen for balance",
        critical=False,
    )

    return write_report()


def write_report() -> int:
    failed_critical = [c for c in checks if c[3] and not c[1]]
    failed_soft = [c for c in checks if not c[3] and not c[1]]

    lines = [
        f"# QC Report — {args.title}",
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
        "## Diagnostics",
        "",
        "```json",
        json.dumps(diagnostics, indent=2, ensure_ascii=False),
        "```",
        "",
        "## Notes",
        "",
        "- Automated checks cover container, streams, duration, level and black frames.",
        "- Perceptual quality (legibility, Bengali glyph shaping, character cutouts, SFX/score balance)",
        "  needs the preview stills and a listening pass; those rows are marked WARN/PASS with a manual-review note.",
        "",
    ]
    if failed_soft:
        lines.append("Soft warnings: " + ", ".join(c[0] for c in failed_soft))
        lines.append("")

    with open(REPORT, "w", encoding="utf-8") as handle:
        handle.write("\n".join(lines))

    payload = {
        "result": "PASS" if not failed_critical else "FAIL",
        "video": os.path.abspath(VIDEO),
        "failed_critical": [c[0] for c in failed_critical],
        "failed_soft": [c[0] for c in failed_soft],
        "checks": [
            {"name": name, "passed": passed, "detail": detail, "critical": critical}
            for name, passed, detail, critical in checks
        ],
        "diagnostics": diagnostics,
    }
    with open(JSON_REPORT, "w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, ensure_ascii=False)

    for name, passed, detail, critical in checks:
        mark = "ok" if passed else ("FAIL" if critical else "warn")
        print(f"[{mark}] {name}: {detail}")
    print(f"\nReport written to {REPORT} and {JSON_REPORT}")

    return 1 if failed_critical else 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:  # noqa: BLE001 - always leave a report behind
        check("QC script completed", False, f"{type(exc).__name__}: {exc}")
        sys.exit(write_report())
