#!/usr/bin/env python3
"""Synthesize the quiet, bright editorial score bed for the 59.3 s sample.

No samples, no third-party audio: warm felt-piano style plucks over a soft
sustained pad, a gentle bass pulse and a brushed shaker. The bed stays well
under the narration (mixed at ~0.12), so it should feel like paper-and-ink
background music rather than a cinematic drone.

Output: 48 kHz, 16-bit mono WAV, peak -6 dBFS.

Usage:
    python3 scripts/generate_score.py public/audio/score-sample.wav
"""
from __future__ import annotations

import sys
import wave

import numpy as np

SR = 48000
DURATION = 59.3
BPM = 96.0
BEAT = 60.0 / BPM
rng = np.random.default_rng(7)

# (start, end, root midi, chord intervals) — bright F-major family.
SECTIONS = [
    (0.0, 7.6, 53, [0, 4, 7, 12]),      # F  — 2015, Mirpur
    (7.6, 16.9, 48, [0, 4, 7, 11]),     # Cmaj7 — same office
    (16.9, 27.2, 50, [0, 3, 7, 10]),    # Dm7 — 2025 reveal
    (27.2, 35.4, 46, [0, 4, 7, 9]),     # Bb6 — Suman / debt
    (35.4, 44.5, 53, [0, 4, 7, 11]),    # Fmaj7 — the question
    (44.5, 52.2, 48, [0, 4, 7, 9]),     # C6 — answer
    (52.2, 59.3, 53, [0, 4, 7, 12]),    # F  — habit / close
]

# One-bar arpeggio pattern (indices into the chord tones), with accents.
PATTERN = [(0, 1.0), (2, 0.72), (1, 0.82), (3, 0.7), (2, 0.76), (1, 0.66), (0, 0.7), (2, 0.6)]


def midi_hz(midi: float) -> float:
    return 440.0 * 2 ** ((midi - 69) / 12)


def pluck(freq: float, length: int, amp: float) -> np.ndarray:
    t = np.arange(length) / SR
    env = np.exp(-t * 3.1) * (1 - np.exp(-t * 260))
    tone = (
        np.sin(2 * np.pi * freq * t)
        + 0.42 * np.sin(2 * np.pi * freq * 2.004 * t)
        + 0.16 * np.sin(2 * np.pi * freq * 3.01 * t)
    )
    return amp * env * tone


def pad(freq: float, length: int, amp: float, phase: float) -> np.ndarray:
    t = np.arange(length) / SR
    breath = 0.75 + 0.25 * np.sin(2 * np.pi * 0.07 * t + phase)
    tone = (
        np.sin(2 * np.pi * freq * t + phase)
        + 0.35 * np.sin(2 * np.pi * freq * 1.002 * t + phase * 1.3)
        + 0.18 * np.sin(2 * np.pi * freq * 2.001 * t + phase * 0.7)
    )
    return amp * breath * tone


def section_at(time: float) -> tuple[int, list[int]]:
    for start, end, root, intervals in SECTIONS:
        if start <= time < end:
            return root, intervals
    return SECTIONS[-1][2], SECTIONS[-1][3]


def build() -> np.ndarray:
    n = int(SR * DURATION)
    out = np.zeros(n, dtype=np.float64)

    # Warm pad + bass, section by section.
    for start, end, root, intervals in SECTIONS:
        a = int(start * SR)
        b = min(n, int(end * SR))
        length = b - a
        if length <= 0:
            continue
        block = np.zeros(length, dtype=np.float64)
        for index, interval in enumerate(intervals):
            block += pad(midi_hz(root + interval), length, 0.11 / (1 + index * 0.35), index * 1.7)
        block += 0.34 * pad(midi_hz(root - 12), length, 0.9, 0.4)
        fade = min(int(0.8 * SR), length // 2)
        if fade > 0:
            block[:fade] *= np.linspace(0, 1, fade) ** 1.2
            block[-fade:] *= np.linspace(1, 0, fade) ** 1.2
        out[a:b] += block

    # Plucked arpeggio on every beat.
    total_beats = int(DURATION / BEAT)
    for beat in range(total_beats):
        time = beat * BEAT
        root, intervals = section_at(time)
        tone_index, accent = PATTERN[beat % len(PATTERN)]
        interval = intervals[tone_index % len(intervals)]
        octave = 12 if tone_index >= len(intervals) else 0
        freq = midi_hz(root + interval + octave)
        length = min(n - int(time * SR), int(1.9 * SR))
        if length <= 0:
            continue
        note = pluck(freq, length, 0.17 * accent)
        a = int(time * SR)
        out[a : a + length] += note

    # Final sustained F-major chord, ringing into the last frame.
    final_start = DURATION - 3.4
    a = int(final_start * SR)
    length = n - a
    if length > 0:
        for index, interval in enumerate([0, 4, 7, 12, 16]):
            out[a:] += pad(midi_hz(53 + interval), length, 0.1 / (1 + index * 0.4), index * 2.1)

    # Brushed shaker on off-beats, very quiet.
    for beat in range(total_beats):
        a = int((beat * BEAT + BEAT * 0.5) * SR)
        length = int(0.09 * SR)
        if a + length >= n:
            continue
        noise = rng.standard_normal(length)
        envelope = np.exp(-np.arange(length) / (0.016 * SR))
        out[a : a + length] += noise * envelope * 0.024

    # Gentle top-end air.
    noise = rng.standard_normal(n)
    spectrum = np.fft.rfft(noise)
    freqs = np.fft.rfftfreq(n, 1 / SR)
    mask = np.exp(-((freqs - 1400.0) ** 2) / (2 * 900.0 ** 2))
    air = np.fft.irfft(spectrum * mask, n)
    air /= np.max(np.abs(air)) + 1e-12
    out += 0.018 * air

    # Slow dynamic breathing + safe fades.
    t = np.arange(n) / SR
    out *= 0.9 + 0.1 * np.sin(2 * np.pi * 0.05 * t)
    fade_in = int(1.8 * SR)
    fade_out = int(2.6 * SR)
    out[:fade_in] *= np.linspace(0, 1, fade_in) ** 1.3
    out[-fade_out:] *= np.linspace(1, 0, fade_out) ** 1.5

    peak = np.max(np.abs(out))
    out = out / peak * (10 ** (-6 / 20))
    return out


def main() -> int:
    target = sys.argv[1] if len(sys.argv) > 1 else "public/audio/score-sample.wav"
    samples = (build() * 32767).astype("<i2")
    with wave.open(target, "wb") as handle:
        handle.setnchannels(1)
        handle.setsampwidth(2)
        handle.setframerate(SR)
        handle.writeframes(samples.tobytes())
    print(f"wrote {target} ({len(samples)/SR:.2f} s, peak -6 dBFS)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
