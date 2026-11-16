#!/usr/bin/env python3
"""Cut the two supplied character photos out of their white studio background.

The originals in ~/Download are never modified. A border flood-fill removes the
connected near-white background (including the soft floor shadow), the alpha
edge is feathered, white fringe is de-spilled, and the result is trimmed and
saved as a transparent PNG under public/images/.

Usage:
    python3 scripts/cutout_characters.py <image-a> <image-b>
"""
from __future__ import annotations

import sys
from collections import deque

import numpy as np
from PIL import Image, ImageFilter

SRC = [
    ("/storage/emulated/0/Download/1794464679908.png", "public/images/rakib.png"),
    ("/storage/emulated/0/Download/1794464682742.png", "public/images/suman.png"),
]


def flood_background(rgb: np.ndarray, tolerance: float = 42.0) -> np.ndarray:
    h, w, _ = rgb.shape
    # Distance from the sampled studio white (254) rather than pure 255.
    dist = np.sqrt(((rgb.astype(np.float32) - 254.0) ** 2).sum(axis=2))
    candidate = dist < tolerance
    visited = np.zeros((h, w), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for x in range(w):
        for y in (0, h - 1):
            if candidate[y, x] and not visited[y, x]:
                visited[y, x] = True
                queue.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if candidate[y, x] and not visited[y, x]:
                visited[y, x] = True
                queue.append((y, x))

    while queue:
        y, x = queue.popleft()
        if y > 0 and candidate[y - 1, x] and not visited[y - 1, x]:
            visited[y - 1, x] = True
            queue.append((y - 1, x))
        if y + 1 < h and candidate[y + 1, x] and not visited[y + 1, x]:
            visited[y + 1, x] = True
            queue.append((y + 1, x))
        if x > 0 and candidate[y, x - 1] and not visited[y, x - 1]:
            visited[y, x - 1] = True
            queue.append((y, x - 1))
        if x + 1 < w and candidate[y, x + 1] and not visited[y, x + 1]:
            visited[y, x + 1] = True
            queue.append((y, x + 1))

    return ~visited


def cutout(src: str, dst: str, height: int = 1500) -> dict:
    image = Image.open(src).convert("RGB")
    rgb = np.asarray(image)
    foreground = flood_background(rgb)

    alpha = Image.fromarray((foreground * 255).astype(np.uint8))
    # Soften the cut edge and pull it in slightly so no white halo survives.
    alpha = alpha.filter(ImageFilter.GaussianBlur(1.1))
    a = np.asarray(alpha).astype(np.float32) / 255.0
    a = np.clip((a - 0.18) / 0.64, 0.0, 1.0)

    # De-spill: undo the white matte on semi-transparent edge pixels.
    safe = np.maximum(a, 0.12)[..., None]
    color = (rgb.astype(np.float32) - (1.0 - a[..., None]) * 254.0) / safe
    color = np.clip(color, 0, 255)

    rgba = np.dstack([color, a[..., None] * 255.0]).astype(np.uint8)
    out = Image.fromarray(rgba, "RGBA")

    ys, xs = np.where(a > 0.06)
    pad = 24
    box = (
        max(0, xs.min() - pad),
        max(0, ys.min() - pad),
        min(out.width, xs.max() + pad),
        min(out.height, ys.max() + pad),
    )
    out = out.crop(box)
    if out.height != height:
        width = round(out.width * height / out.height)
        out = out.resize((width, height), Image.LANCZOS)
    out.save(dst, optimize=True)
    return {
        "source": src,
        "output": dst,
        "source_size": [image.width, image.height],
        "crop_box": list(box),
        "output_size": [out.width, out.height],
        "foreground_coverage": round(float(foreground.mean()), 3),
    }


def main() -> int:
    if len(sys.argv) == 3:
        pairs = [(sys.argv[1], "public/images/rakib.png"), (sys.argv[2], "public/images/suman.png")]
    else:
        pairs = SRC
    for src, dst in pairs:
        info = cutout(src, dst)
        print(info)
    return 0


if __name__ == "__main__":
    sys.exit(main())
