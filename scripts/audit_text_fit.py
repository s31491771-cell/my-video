#!/usr/bin/env python3
"""Approximate layout audit for the 75-scene bright renderer.

Measures every rendered Bengali string with the bundled Noto Sans Bengali font,
wraps it greedily at the template's real container width and reports any block
that would overflow its allowed line count. This is a pre-render safety net:
the actual CSS wrap can differ slightly, so a 1-line overflow is a warning,
2+ lines is treated as an error.
"""
from __future__ import annotations

import json
import re
import sys

from PIL import ImageFont

ROOT = "."
STORY = "src/story.ts"
FONT = "public/fonts/NotoSansBengali.ttf"

raw = open(STORY, encoding="utf-8").read()
pattern = re.compile(
    r'id: "(S\d+)", type: "(\w+)", start: ([\d.]+), end: ([\d.]+),\s*'
    r'startFrame: (\d+), durationInFrames: (\d+),\s*'
    r'accent: "([^"]+)", cueIds: \[([^\]]*)\],\s*data: (\{.*?\}),\s*\}',
    re.S,
)
scenes = []
for match in pattern.finditer(raw):
    scenes.append({
        "id": match.group(1),
        "type": match.group(2),
        "start": float(match.group(3)),
        "frames": int(match.group(6)),
        "accent": match.group(7),
        "cueIds": [int(x.strip()) for x in match.group(8).split(",") if x.strip()],
        "data": json.loads(match.group(9)),
    })

if len(scenes) != 75:
    print(f"ERROR: parsed {len(scenes)} scenes, expected 75")
    sys.exit(1)

font_cache: dict[int, ImageFont.FreeTypeFont] = {}


def font(size: int) -> ImageFont.FreeTypeFont:
    if size not in font_cache:
        font_cache[size] = ImageFont.truetype(FONT, size)
    return font_cache[size]


def text_width(text: str, size: int) -> float:
    return font(size).getlength(text)


def wrap_count(text: str, size: int, width: float) -> tuple[int, bool]:
    """Return (line count, has_unbreakable_word)."""
    words = text.split()
    if not words:
        return 1, False
    lines = 1
    current = ""
    for word in words:
        if text_width(word, size) > width:
            return 99, True
        candidate = word if not current else current + " " + word
        if text_width(candidate, size) <= width:
            current = candidate
        else:
            lines += 1
            current = word
    return lines, False


def headline_size(text: str, width: float, maximum: int = 76, minimum: int = 42, lines: int = 2) -> int:
    raw_size = (width * lines) / (max(8, len(text)) * 0.6)
    return round(max(minimum, min(maximum, raw_size)))


issues: list[tuple[str, str, str]] = []
warnings: list[tuple[str, str, str]] = []


def check(scene: dict, label: str, text: str, size: int, width: float, allowed: int) -> None:
    if not text:
        return
    lines, unbreakable = wrap_count(text, size, width)
    if unbreakable:
        issues.append((scene["id"], label, f"unbreakable word at {size}px / {width:.0f}px: {text[:50]}"))
    elif lines > allowed:
        target = issues if lines > allowed + 1 else warnings
        target.append((scene["id"], label, f"{lines} lines (allowed {allowed}) at {size}px / {width:.0f}px: {text[:60]}"))
    actual = text_width(text, size)
    if lines == 1 and actual > width * 1.02:
        target = issues if actual > width * 1.15 else warnings
        target.append((scene["id"], label, f"single line {actual:.0f}px > {width:.0f}px at {size}px"))


for scene in scenes:
    d = scene["data"]
    t = scene["type"]
    sid = scene["id"]
    if t == "opening":
        check(scene, "year", d.get("year", ""), 206, 930, 1)
        check(scene, "city", d.get("city", ""), 62, 930, 1)
        check(scene, "age chip", f"বয়স {d.get('age','')} · একই অফিস", 21, 800, 1)
    elif t == "statement":
        headline = d.get("headline", "")
        size = headline_size(headline, 1000, 72, 44, 2)
        check(scene, "headline", headline, size, 1000, 2)
        check(scene, "sub", d.get("sub", ""), 31, 940, 2)
        big = d.get("big", "")
        if big and not big.startswith("৳"):
            bsize = 44 if len(big) > 20 else 54 if len(big) > 12 else 70
            check(scene, "big", big, bsize, 860, 1)
        if big.startswith("৳"):
            check(scene, "big amount", big.replace("৳", "").strip(), 92, 700, 1)
        # Side card
        if d.get("tone") == "dark" or d.get("big") or any(
            key in f"{d.get('kicker','')} {headline} {big}" for key in ["মিনিট", "শূন্য", "অটোমেশন", "পরের মাস", "সিস্টেম", "ভুল", "কঠিন", "প্রমাণ"]
        ):
            check(scene, "side sub", d.get("sub", ""), 23, 530, 2)
    elif t == "compare":
        size = headline_size(d.get("headline", ""), 1500, 66, 46, 1)
        check(scene, "headline", d.get("headline", ""), size, 1500, 1)
        for side in ("left", "right"):
            value = d[side]["value"]
            check(scene, f"{side} value", value, 44 if len(value) > 12 else 58, 430, 1)
            check(scene, f"{side} note", d[side]["note"], 24, 430, 1)
        check(scene, "chip", d.get("chip", ""), 26, 900, 1)
    elif t == "question":
        size = headline_size(d.get("question", ""), 1460, 72, 44, 2)
        check(scene, "question", d.get("question", ""), size, 1450, 2)
        check(scene, "answer", d.get("answer", ""), 38 if len(d.get("answer", "")) > 26 else 46, 1130, 1)
        check(scene, "sub", d.get("sub", ""), 24, 1130, 1)
    elif t == "habit":
        check(scene, "headline", d.get("headline", ""), headline_size(d.get("headline", ""), 960, 70, 44, 2), 960, 2)
        check(scene, "sub", d.get("sub", ""), 34, 960, 2)
        check(scene, "cta", d.get("cta", ""), 25, 960, 1)
    elif t == "engine":
        check(scene, "headline", d.get("headline", ""), headline_size(d.get("headline", ""), 1400, 64, 44, 1), 1400, 1)
        check(scene, "sub", d.get("sub", ""), 30, 1400, 1)
        for side in ("left", "right"):
            check(scene, f"{side} value", d.get(f"{side}Value", ""), 38, 390, 2)
    elif t == "ledger":
        check(scene, "headline", d.get("headline", ""), headline_size(d.get("headline", ""), 1560, 56, 40, 1), 1560, 1)
        for row in d.get("rows", []):
            check(scene, "row label", row["label"], 28, 700, 1)
        check(scene, "remaining", d.get("remaining", "").replace("৳", "").strip(), 76, 520, 1)
        check(scene, "remaining label", d.get("remainingLabel", ""), 26, 520, 1)
    elif t == "sequence":
        check(scene, "headline", d.get("headline", ""), headline_size(d.get("headline", ""), 1260, 60, 42, 2), 1260, 2)
        for step in d.get("steps", []):
            check(scene, "step", step, 34, 428, 2)
        check(scene, "outcome", d.get("outcome", ""), 31, 700, 1)
    elif t == "rule":
        check(scene, "headline", d.get("headline", ""), headline_size(d.get("headline", ""), 1500, 64, 44, 1), 1500, 1)
        check(scene, "sub", d.get("sub", ""), 26, 1100, 1)
    elif t == "tiers":
        check(scene, "headline", d.get("headline", ""), headline_size(d.get("headline", ""), 1580, 60, 42, 1), 1580, 1)
        for tier in d.get("tiers", []):
            check(scene, "tier note", tier["note"], 24, 476, 1)
        check(scene, "sub", d.get("sub", ""), 26, 1300, 1)
    elif t == "growth":
        check(scene, "headline", d.get("headline", ""), headline_size(d.get("headline", ""), 1440, 58, 40, 1), 1440, 1)
        check(scene, "total", d.get("total", "").replace("৳", "").strip(), 62, 650, 1)
        check(scene, "own", d.get("own", ""), 28, 290, 1)
        check(scene, "profit", d.get("profit", ""), 28, 290, 1)
        check(scene, "extra", d.get("extra", ""), 25, 720, 2)
        check(scene, "monthly chip", f"মাসে ৳ {d.get('monthly','')}", 21, 500, 1)
    elif t == "trap":
        check(scene, "headline", d.get("headline", ""), headline_size(d.get("headline", ""), 1600, 56, 40, 2), 1600, 2)
        for step in d.get("steps", []):
            check(scene, "step", step, 29, 1090, 1)
        check(scene, "sub", d.get("sub", ""), 26, 1300, 1)
    elif t == "phone":
        check(scene, "headline", d.get("headline", ""), headline_size(d.get("headline", ""), 1010, 60, 42, 2), 1010, 2)
        for step in d.get("steps", []):
            check(scene, "step", step, 30, 930, 1)
        check(scene, "chip", f"বাকি ৳ {d.get('income','')}", 21, 360, 1)
    elif t == "wait":
        check(scene, "headline", d.get("headline", ""), headline_size(d.get("headline", ""), 1520, 66, 44, 1), 1520, 1)
        for excuse in d.get("excuses", []):
            check(scene, "excuse", excuse, 29, 472, 3)
        check(scene, "sub", d.get("sub", ""), 27, 1200, 1)
    elif t == "cta":
        check(scene, "headline", d.get("headline", ""), headline_size(d.get("headline", ""), 1500, 68, 44, 2), 1500, 2)
        for option in d.get("options", []):
            check(scene, "option", option, 46, 520, 1)
        check(scene, "next", d.get("next", ""), 31, 1200, 1)
    elif t == "outro":
        check(scene, "headline", d.get("headline", ""), headline_size(d.get("headline", ""), 1180, 92, 48, 2), 1180, 2)
        check(scene, "sub", d.get("sub", ""), 37, 1180, 2)
        check(scene, "signature", d.get("signature", ""), 30, 900, 1)
    elif t == "quote":
        check(scene, "quote", d.get("quote", ""), headline_size(d.get("quote", ""), 1080, 78, 48, 1), 1080, 1)
        check(scene, "sub", d.get("sub", ""), 40, 1080, 1)


def dump(title: str, rows: list[tuple[str, str, str]]) -> None:
    print(f"\n{title}: {len(rows)}")
    for sid, label, detail in rows:
        print(f"  {sid} {label}: {detail}")


dump("ERRORS (must fix)", issues)
dump("WARNINGS (review)", warnings)

sys.exit(1 if issues else 0)
