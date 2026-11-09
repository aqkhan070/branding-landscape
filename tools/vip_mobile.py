"""Crop, sanitize, and grade EarthCo mobile screenshots for the exhibit phone."""
from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter

# Reuse redaction helpers from the web VIP pipeline
from vip_modules import cover_green_chip_money, cover_yellow_on_green, grade, redact

ROOT = Path(r"d:\Earthco\earthco-exhibit")
DOC = ROOT / "tools" / "doc-mobile" / "unzipped" / "images"
RAW = ROOT / "tools" / "mobile-raw"
OUT = ROOT / "public" / "mobile"

# Doc image → exhibit phone shot id (aligned to phoneScreens)
MAP = {
    "home": "image28.png",       # Dashboard
    "sr": "image5.png",          # Service Request
    "map": "image6.png",         # Map / customers
    "estimates": "image27.png",  # Estimates detail
    "pipeline": "image25.png",   # CRM Pipeline
    "fleet": "image24.png",      # Fleet dashboard
    # extras kept for future / side phones
    "trucks": "image13.png",
    "activities": "image16.png",
    "crm": "image19.png",
    "pm": "image20.png",
    "treemap": "image30.png",
}


def crop_phone(im: Image.Image) -> Image.Image:
    """Trim status-bar chrome lightly; keep the full phone UI width."""
    w, h = im.size
    top = int(h * 0.018)
    bottom = h - int(h * 0.008)
    left = int(w * 0.01)
    right = w - int(w * 0.01)
    return im.crop((left, top, right, bottom))


def main():
    import sys

    only = set(sys.argv[1:]) if len(sys.argv) > 1 else None
    RAW.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)

    for key, name in MAP.items():
        if only and key not in only:
            continue
        src = DOC / name
        if not src.exists():
            print(f"MISSING {src}")
            continue
        raw_copy = RAW / f"{key}.png"
        shutil.copy2(src, raw_copy)
        print(key)
        im = Image.open(src)
        im = crop_phone(im)
        im = redact(im, 2)
        im = redact(im, 2)
        if key in {"fleet", "trucks", "pm"}:
            im = cover_green_chip_money(im)
        if key in {"crm", "pipeline", "home"}:
            im = cover_yellow_on_green(im)
        im = grade(im)
        # Cap long edge so phone assets stay light
        max_edge = 1200
        w, h = im.size
        scale = min(1.0, max_edge / max(w, h))
        if scale < 1:
            im = im.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
        dest = OUT / f"{key}.webp"
        im.save(dest, "WEBP", quality=80, method=6)
        print(f"  {im.size}  {dest.stat().st_size // 1024}kb")


if __name__ == "__main__":
    main()
