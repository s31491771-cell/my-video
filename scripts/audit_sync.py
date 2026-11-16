#!/usr/bin/env python3
"""Propose per-element cue beats by matching on-screen text to the narration.

For every scene it compares each on-screen element (headline, sub, big, steps,
rows, tiers ...) with the SRT lines spoken inside that scene and reports the
cue that actually speaks it, plus timing problems (blank screen while the
voice talks, elements that appear before their line, or after it).
"""
from __future__ import annotations

import json
import re
import sys

DIGITS = str.maketrans("০১২৩৪৫৬৭৮৯", "0123456789")

raw = open("src/story.ts", encoding="utf-8").read()
cues = {}
for m in re.finditer(r'\{id: (\d+), start: ([\d.]+), end: ([\d.]+), text: "(.*?)"\}', open("src/cues.ts", encoding="utf-8").read()):
    cues[int(m.group(1))] = (float(m.group(2)), float(m.group(3)), m.group(4))

pat = re.compile(
    r'id: "(S\d+)", type: "(\w+)", start: ([\d.]+), end: ([\d.]+),\s*'
    r'startFrame: (\d+), durationInFrames: (\d+),\s*accent: "[^"]+", cueIds: \[([^\]]*)\],\s*'
    r"data: (\{.*?\}),\s*\}",
    re.S,
)
scenes = []
for m in pat.finditer(raw):
    scenes.append(
        dict(
            id=m.group(1),
            type=m.group(2),
            start=float(m.group(3)),
            end=float(m.group(4)),
            ids=[int(x) for x in m.group(7).split(",") if x.strip()],
            data=json.loads(m.group(8)),
        )
    )

STOP = {"আর", "এই", "একই", "একটা", "একটি", "আপনি", "আপনার", "আমি", "তার", "তারা", "এখন", "কিন্তু", "তবু", "হয়", "হয়ে", "করে", "করেন", "দিয়ে", "থেকে", "তারপর"}


def numbers(text: str) -> set[int]:
    """Every numeric value in the text, with লাখ/হাজার/কোটি expanded."""
    out: set[int] = set()
    t = text.translate(DIGITS)
    pattern = r"([\d,]+)\s*(?:লাখ\s*([\d,]+)?\s*হাজার|লাখ|হাজার|কোটি)?"
    for match in re.finditer(pattern, t):
        clean = match.group(1).replace(",", "")
        if not clean.isdigit():
            continue
        n = int(clean)
        tail = match.group(0)
        extra = match.group(2)
        if "লাখ" in tail and "হাজার" in tail:
            n = n * 100000
            if extra and extra.replace(",", "").isdigit():
                n += int(extra.replace(",", "")) * 1000
        elif "লাখ" in tail:
            n *= 100000
        elif "হাজার" in tail:
            n *= 1000
        elif "কোটি" in tail:
            n *= 10000000
        out.add(n)
    return out


def tokens(text: str) -> set[str]:
    t = text.translate(DIGITS)
    t = re.sub(r"[^\w\s]", " ", t)
    words = {w for w in t.split() if w and w not in STOP}
    return words


def score(element_text: str, cue_text: str) -> float:
    a, b = tokens(element_text), tokens(cue_text)
    if not a or not b:
        return 0.0
    overlap = len(a & b) / len(a | b)
    na, nb = numbers(element_text), numbers(cue_text)
    number_bonus = 0.0
    if na and nb:
        number_bonus = 0.6 if (na & nb) else -0.3
    elif na and not nb:
        number_bonus = -0.25
    return overlap + number_bonus


def cue_frame(scene, cue_id):
    return max(0, round((cues[cue_id][0] - scene["start"]) * 30))


def beat(scene, key, fallback_index=0):
    b = scene["data"].get("beats", {})
    if isinstance(b.get(key), int) and b[key] > 0:
        return cue_frame(scene, b[key]), b[key]
    ids = scene["ids"]
    return cue_frame(scene, ids[min(fallback_index, len(ids) - 1)]), ids[min(fallback_index, len(ids) - 1)]


def item_beat(scene, key, index, start_index=0):
    b = scene["data"].get("beats", {})
    if isinstance(b.get(f"{key}{index}"), int):
        return cue_frame(scene, b[f"{key}{index}"]), b[f"{key}{index}"]
    ids = scene["ids"]
    last = len(ids) - 1
    target = start_index + index
    overflow = max(0, target - last)
    return cue_frame(scene, ids[min(target, last)]) + overflow * 10, ids[min(target, last)]


def elements(scene):
    """(label, text, frame, beat_cue_id) for every visible element."""
    d = scene["data"]
    t = scene["type"]
    out = []

    def add(label, text, frame, cue_id):
        if text:
            out.append((label, str(text), frame, cue_id))

    def b(key, fallback=0):
        return beat(scene, key, fallback)

    if t not in ("opening", "quote", "outro"):
        f, c = b("kicker", 0)
        add("kicker", d.get("kicker"), f, c)

    if t == "opening":
        f, c = b("kicker", 0); add("kicker", d.get("kicker") or "একটি সত্যি গল্পের শুরু", f, c)
        f, c = b("year", 0); add("year", d.get("year"), f, c)
        f, c = b("city", 1); add("city", d.get("city"), f, c)
        f, c = b("names", 2); add("names", " ".join(d.get("names", [])), f, c)
        f, c = b("age", 3); add("age", d.get("age"), f, c)
    elif t == "statement":
        f, c = b("headline", 0); add("headline", d.get("headline"), f, c)
        f, c = b("sub", 1); add("sub", d.get("sub"), f, c)
        f, c = b("foot", 2); add("foot", d.get("foot"), f, c)
        f, c = b("note", 3); add("note", d.get("note"), f, c)
        f, c = b("big", 1); add("big", d.get("big"), f, c)
        f, c = b("side", 1); add("side", d.get("sideNote") or d.get("sub") or d.get("bigLabel"), f, c)
        f, c = b("character", 2)
        if d.get("character"):
            add("character", d.get("character"), f, c)
    elif t == "compare":
        f, c = b("headline", 0); add("headline", d.get("headline"), f, c)
        for side, fb in (("left", 0), ("right", 1)):
            s = d.get(side) or {}
            f, c = b(side, fb)
            add(side, f"{s.get('name')} {s.get('value')} {s.get('note')}", f, c)
        f, c = b("chip", 1); add("chip", d.get("chip"), f, c)
    elif t == "question":
        f, c = b("note", 0); add("note", d.get("note"), f, c)
        f, c = b("question", 0); add("question", d.get("question"), f, c)
        f, c = b("answer", 1); add("answer", d.get("answer"), f, c)
        f, c = b("sub", 1); add("sub", d.get("sub"), f, c)
    elif t == "habit":
        f, c = b("percent", 0); add("percent", d.get("percent"), f, c)
        f, c = b("headline", 0); add("headline", d.get("headline"), f, c)
        f, c = b("sub", 1); add("sub", d.get("sub"), f, c)
        f, c = b("cta", 1); add("cta", d.get("cta"), f, c)
    elif t == "engine":
        f, c = b("headline", 0); add("headline", d.get("headline"), f, c)
        f, c = b("sub", 1); add("sub", d.get("sub"), f, c)
        f, c = b("left", 0); add("left", f"{d.get('leftTitle')} {d.get('leftValue')}", f, c)
        f, c = b("right", 1); add("right", f"{d.get('rightTitle')} {d.get('rightValue')}", f, c)
    elif t == "ledger":
        f, c = b("headline", 0); add("headline", d.get("headline"), f, c)
        f, c = b("salary", 0); add("salary", d.get("salary"), f, c)
        for i, row in enumerate(d.get("rows", [])):
            f, c = item_beat(scene, "row", i, 1)
            add(f"row{i}", f"{row.get('label')} {row.get('value')}", f, c)
        f, c = b("remainingLabel", len(scene["ids"]) - 1)
        add("remainingLabel", d.get("remainingLabel"), f, c)
        f, c = b("remaining", len(scene["ids"]) - 1)
        add("remaining", d.get("remaining"), f, c)
        f, c = b("book", len(scene["ids"]) - 1); add("book", "মাসের খাতা", f, c)
    elif t == "sequence":
        f, c = b("headline", 0); add("headline", d.get("headline"), f, c)
        for i, step in enumerate(d.get("steps", [])):
            f, c = item_beat(scene, "step", i)
            add(f"step{i}", step, f, c)
        f, c = b("outcome", len(scene["ids"]) - 1); add("outcome", d.get("outcome"), f, c)
    elif t == "rule":
        f, c = b("headline", 0); add("headline", d.get("headline"), f, c)
        f, c = b("bar", 1); add("bar", f"{d.get('percent')} {d.get('leftLabel')} {d.get('rightLabel')}", f, c)
        f, c = b("sub", 1); add("sub", d.get("sub"), f, c)
    elif t == "tiers":
        f, c = b("headline", 0); add("headline", d.get("headline"), f, c)
        for i, tier in enumerate(d.get("tiers", [])):
            f, c = b(f"tier{i}", 0)
            if c == b("headline", 0)[1]:
                f = b("headline", 0)[0]
            add(f"tier{i}", f"{tier.get('title')} {tier.get('pct')} {tier.get('amount')} {tier.get('note')}", f, c)
        f, c = b("sub", len(scene["ids"]) - 1); add("sub", d.get("sub"), f, c)
        f, c = b("note", len(scene["ids"]) - 1); add("note", d.get("note"), f, c)
    elif t == "growth":
        f, c = b("headline", 0); add("headline", d.get("headline"), f, c)
        f, c = b("total", 0); add("total", d.get("total"), f, c)
        f, c = b("own", 1); add("own", d.get("own"), f, c)
        f, c = b("profit", 1); add("profit", d.get("profit"), f, c)
        f, c = b("chips", 1); add("chips", d.get("monthly") or d.get("rate"), f, c)
        chips = d.get("chips") or []
        if isinstance(chips, list):
            for i, chip in enumerate(chips):
                f, c = b(f"chip{i}", 1)
                add(f"chip{i}", chip, f, c)
        f, c = b("extra", len(scene["ids"]) - 1); add("extra", d.get("extra"), f, c)
    elif t == "trap":
        f, c = b("headline", 0); add("headline", d.get("headline"), f, c)
        for i, step in enumerate(d.get("steps", [])):
            f, c = item_beat(scene, "step", i)
            add(f"step{i}", step, f, c)
        f, c = b("sub", len(scene["ids"]) - 1); add("sub", d.get("sub"), f, c)
    elif t == "phone":
        f, c = b("headline", 0); add("headline", d.get("headline"), f, c)
        for i, step in enumerate(d.get("steps", [])):
            f, c = item_beat(scene, "step", i)
            add(f"step{i}", step, f, c)
        f, c = b("phone", 0); add("phone", f"{d.get('amount')} {d.get('income')}", f, c)
    elif t == "wait":
        f, c = b("headline", 0); add("headline", d.get("headline"), f, c)
        for i, excuse in enumerate(d.get("excuses", [])):
            f, c = item_beat(scene, "excuse", i)
            add(f"excuse{i}", excuse, f, c)
        f, c = b("sub", len(scene["ids"]) - 1); add("sub", d.get("sub"), f, c)
    elif t == "cta":
        f, c = b("headline", 0); add("headline", d.get("headline"), f, c)
        f, c = b("options", 0); add("options", " ".join(d.get("options", [])), f, c)
        f, c = b("next", len(scene["ids"]) - 1); add("next", d.get("next"), f, c)
    elif t == "outro":
        f, c = b("headline", 0); add("headline", d.get("headline"), f, c)
        f, c = b("sub", len(scene["ids"]) - 1); add("sub", d.get("sub"), f, c)
    elif t == "quote":
        f, c = b("kicker", 0); add("kicker", d.get("kicker"), f, c)
        f, c = b("quote", 0); add("quote", d.get("quote"), f, c)
        f, c = b("sub", 1); add("sub", d.get("sub"), f, c)
    return out


only = sys.argv[1] if len(sys.argv) > 1 else None
problems = 0
for scene in scenes:
    if only and scene["id"] != only:
        continue
    els = elements(scene)
    ids = scene["ids"]
    lines = []
    for cue_id in ids:
        start, end, text = cues[cue_id]
        local_start = round((start - scene["start"]) * 30)
        local_end = round((end - scene["start"]) * 30)
        on_screen = [e for e in els if e[2] <= local_end]
        fresh = [e for e in on_screen if local_start - 4 <= e[2] <= local_end]
        early = [e for e in on_screen if e[3] > cue_id]
        late = [e for e in els if e[3] == cue_id and e[2] > local_end]
        # spoken numbers that are nowhere on screen
        said = numbers(text)
        shown: set[int] = set()
        for e in on_screen:
            shown |= numbers(e[1])
        missing = {n for n in said if n not in shown}
        flag = ""
        if not on_screen:
            flag += " BLANK"
        elif not fresh:
            flag += " NONEW"
        if missing:
            flag += f" NUM-MISSING({sorted(missing)})"
        if early:
            flag += f" EARLY({','.join(e[0] for e in early)})"
        if late:
            flag += f" LATE({','.join(e[0] for e in late)})"
        if flag:
            problems += 1
            lines.append(f"  cue{cue_id} @{start:.2f} VO: {text}{flag}")
            for label, value, frame, cid in early:
                lines.append(f"      early [{label}] '{value[:40]}' speaks at cue{cid}")
            for label, value, frame, cid in late:
                lines.append(f"      late  [{label}] '{value[:40]}' shows {(frame/30):.2f}s after line end")
    if lines:
        print(f"{scene['id']} {scene['type']} cues={ids}")
        print("\n".join(lines))
print(f"\nflagged cue count: {problems}")
