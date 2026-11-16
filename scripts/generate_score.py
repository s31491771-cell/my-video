#!/usr/bin/env python3
"""Synthesize the quiet documentary score bed for the 59.3 s sample.

No samples, no third-party audio: slow sine-partial chords, a filtered air
layer and a soft sub drone. The bed is deliberately sparse so the narration
stays dominant. Output: 48 kHz, 16-bit mono WAV, peak -6 dBFS.

Usage:
    python3 scripts/generate_score.py public/audio/score-sample.wav
"""
from __future__ import annotations

import sys
import wave

import numpy as np

SR = 48000
DURATION = 59.3
rng = np.random.default_rng(21)

# (start, end, root midi, chord intervals in semitones)
SECTIONS = [
    (0.0, 7.6, 50, [0, 3, 7, 12]),      # Dm — 2015, Mirpur
    (7.6, 16.9, 46, [0, 4, 7, 12]),     # Bb — same office
    (16.9, 27.2, 43, [0, 3, 7, 10]),    # Gm — 2025 reveal
    (27.2, 35.4, 45, [0, 3, 7, 10]),    # A dim — Suman / debt
    (35.4, 44.5, 50, [0, 3, 7, 10]),    # Dm — the question
    (44.5, 52.2, 46, [0, 4, 7, 11]),    # Bb maj7 — answer tease
    (52.2, 59.3, 41, [0, 4, 7, 12]),    # F — habit / close
]


def midi_hz(midi: float) -> float:
    return 440.0 * 2 ** ((midi - 69) / 12)


def chord_tone(freq: float, length: int, phase: float) -> np.ndarray:
    t = np.arange(length) / SR
    # Slightly detuned pair + octave gives movement without vibrato wobble.
    wave_ = (
        np.sin(2 * np.pi * freq * t + phase)
        + 0.55 * np.sin(2 * np.pi * freq * 1.003 * t + phase * 1.7)
        + 0.28 * np.sin(2 * np.pi * freq * 2.001 * t + phase * 0.4)
    )
    # Slow breathing amplitude.
    breath = 0.72 + 0.28 * np.sin(2 * np.pi * 0.055 * t + phase)
    return wave_ * breath


def build() -> np.ndarray:
    n = int(SR * DURATION)
    t = np.arange(n) / SR
    out = np.zeros(n, dtype=np.float64)

    for start, end, root, intervals in SECTIONS:
        a = int(start * SR)
        b = min(n, int(end * SR))
        length = b - a
        if length <= 0:
            continue
        section = np.zeros(length, dtype=np.float64)
        for index, interval in enumerate(intervals):
            freq = midi_hz(root + interval)
            amp = 1.0 if index == 0 else 0.55 / index
            section += amp * chord_tone(freq, length, phase=index * 1.31)
        # Sub drone one octave below the root.
        section += 0.9 * np.sin(2 * np.pi * midi_hz(root - 12) * np.arange(length) / SR)
        # Section fades avoid clicks at chord changes.
        fade = int(1.2 * SR)
        env = np.ones(length)
        fade = min(fade, length // 2)
        if fade > 0:
            env[:fade] = np.linspace(0, 1, fade) ** 1.5
            env[-fade:] = np.linspace(1, 0, fade) ** 1.5
        out[a:b] += section * env

    # Air: filtered noise, very quiet, gives the mix a room.
    noise = rng.standard_normal(n)
    spectrum = np.fft.rfft(noise)
    freqs = np.fft.rfftfreq(n, 1 / SR)
    mask = np.exp(-((freqs - 900.0) ** 2) / (2 * 650.0 ** 2))
    air = np.fft.irfft(spectrum * mask, n)
    air /= np.max(np.abs(air)) + 1e-12
    out += 0.05 * air

    # Overall slow swell, gentle fades at both ends.
    out *= 0.82 + 0.18 * np.sin(2 * np.pi * 0.037 * t)
    fade_in = int(2.2 * SR)
    fade_out = int(3.0 * SR)
    out[:fade_in] *= np.linspace(0, 1, fade_in) ** 1.4
    out[-fade_out:] *= np.linspace(1, 0, fade_out) ** 1.6

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
