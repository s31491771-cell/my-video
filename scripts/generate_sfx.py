#!/usr/bin/env python3
"""Generate the original, code-synthesized SFX library for cloud-video-editor.

Every sound is built from math (sine waves, filtered noise, envelopes), so there is
no third-party audio and no licensing question. Output is 48 kHz, 16-bit, mono WAV,
peak-normalized to -3 dBFS; the mix level in the video is set separately in Remotion.

Usage:
    python3 generate_sfx.py <output_dir>

Requires: numpy. Deterministic: the same command always writes identical files.
"""
import sys
import wave
from pathlib import Path

import numpy as np

SR = 48000
RNG_SEED = 7


def t_axis(duration):
    return np.arange(int(SR * duration)) / SR


def fade(x, in_ms=3, out_ms=12):
    """Short fades remove clicks at the start and end of a sound."""
    n_in = max(1, int(SR * in_ms / 1000))
    n_out = max(1, int(SR * out_ms / 1000))
    x = x.copy()
    x[:n_in] *= np.linspace(0, 1, n_in)
    x[-n_out:] *= np.linspace(1, 0, n_out)
    return x


def bandpass_noise(duration, f_start, f_end, q=6.0, rng=None):
    """White noise through a resonant band centred on a sweeping frequency (FFT-free,
    simple state-variable filter), which gives the 'whoosh' character."""
    rng = rng or np.random.default_rng(RNG_SEED)
    n = int(SR * duration)
    noise = rng.standard_normal(n)
    freqs = np.geomspace(f_start, f_end, n)
    out = np.zeros(n)
    low = band = 0.0
    for i in range(n):
        f = 2 * np.sin(np.pi * freqs[i] / SR)
        low += f * band
        high = noise[i] - low - band / q
        band += f * high
        out[i] = band
    return out


def env_attack_decay(n, attack, decay_power=3.0):
    a = max(1, int(n * attack))
    env = np.concatenate([np.linspace(0, 1, a), np.linspace(1, 0, n - a) ** decay_power])
    return env


def whoosh():
    d = 0.55
    x = bandpass_noise(d, 300, 3500, q=4.0)
    x *= np.sin(np.pi * np.linspace(0, 1, len(x))) ** 2
    return x


def swipe():
    d = 0.28
    x = bandpass_noise(d, 1200, 5000, q=5.0)
    x *= env_attack_decay(len(x), 0.25, 2.0)
    return x


def pop():
    d = 0.14
    t = t_axis(d)
    freq = 700 * np.exp(-t * 14) + 180
    phase = 2 * np.pi * np.cumsum(freq) / SR
    return np.sin(phase) * np.exp(-t * 28)


def tick():
    d = 0.06
    t = t_axis(d)
    return (np.sin(2 * np.pi * 2400 * t) + 0.4 * np.sin(2 * np.pi * 4800 * t)) * np.exp(-t * 90)


def ding():
    d = 1.0
    t = t_axis(d)
    base = 880.0
    x = np.zeros_like(t)
    for mult, amp, decay in [(1, 1.0, 5), (2.76, 0.35, 8), (5.4, 0.15, 14)]:
        x += amp * np.sin(2 * np.pi * base * mult * t) * np.exp(-t * decay)
    return x


def coin():
    """Two quick rising notes: used for money, savings, profit moments."""
    d = 0.55
    t = t_axis(d)
    x = np.zeros_like(t)
    for start, f in [(0.0, 1318.5), (0.09, 1760.0)]:
        m = t >= start
        tt = t[m] - start
        x[m] += np.sin(2 * np.pi * f * tt) * np.exp(-tt * 9) + 0.3 * np.sin(2 * np.pi * 2 * f * tt) * np.exp(-tt * 14)
    return x


def riser():
    """Rising tone plus noise for building up to a reveal or a key number."""
    d = 1.0
    t = t_axis(d)
    freq = 200 * np.exp(t * np.log(1600 / 200) / d)
    tone = np.sin(2 * np.pi * np.cumsum(freq) / SR) * 0.5
    noise = bandpass_noise(d, 400, 4500, q=3.0) * 0.5
    return (tone + noise) * (t / d) ** 1.5


def warn():
    """Low double-beep for risk, loss, debt or warning moments."""
    d = 0.45
    t = t_axis(d)
    x = np.zeros_like(t)
    for start in (0.0, 0.2):
        m = (t >= start) & (t < start + 0.15)
        tt = t[m] - start
        x[m] = np.sin(2 * np.pi * 220 * tt) * np.sin(np.pi * tt / 0.15)
    return x


def click():
    d = 0.04
    t = t_axis(d)
    rng = np.random.default_rng(RNG_SEED)
    return rng.standard_normal(len(t)) * np.exp(-t * 160) * 0.6 + np.sin(2 * np.pi * 1500 * t) * np.exp(-t * 120)


LIBRARY = {
    "whoosh": whoosh,   # scene transitions, big slides in/out
    "swipe": swipe,     # quick label, card or icon entrances
    "pop": pop,         # element appearing: icon, bubble, bullet
    "tick": tick,       # counters, list items, timeline steps
    "click": click,     # button, selection, checkbox
    "ding": ding,       # correct answer, highlight, key takeaway
    "coin": coin,       # money, savings, profit, income
    "riser": riser,     # build-up before a reveal or big number
    "warn": warn,       # risk, loss, debt, caution
}


def write_wav(path, samples):
    peak = np.max(np.abs(samples)) or 1.0
    samples = fade(samples / peak * 10 ** (-3 / 20))
    pcm = (np.clip(samples, -1, 1) * 32767).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def main():
    if len(sys.argv) != 2:
        sys.exit("usage: generate_sfx.py <output_dir>")
    out = Path(sys.argv[1])
    out.mkdir(parents=True, exist_ok=True)
    for name, fn in LIBRARY.items():
        write_wav(out / f"{name}.wav", fn())
        print(f"wrote {out / (name + '.wav')}")


if __name__ == "__main__":
    main()
