"""Replace exhibit module screenshots with the labeled images from the Google Doc.

The doc pairs a module name with the following picture. These shots are already
the page (no app sidebar), so they are not cropped. Dollar amounts and emails
are covered the same way as the earlier VIP pass.
"""
from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image

from vip_modules import grade, redact

ROOT = Path(r"D:\Earthco\earthco-exhibit")
MEDIA = ROOT / "tools" / "doc-web" / "unzipped" / "word" / "media"
RAW = ROOT / "tools" / "modules-raw"
OUT = ROOT / "public" / "modules"

# Doc order: label, then the image relationship resolved to a file.
MAP = {
    "dashboard": "image14.png",
    "crm": "image4.png",
    "activities": "image11.png",
    "pipelines": "image12.png",
    "scorecard": "image1.png",
    "estimator": "image3.png",
    "sr": "image6.png",
    "estimates": "image18.png",
    "punchlist": "image8.png",
    "po": "image15.png",
    "routes": "image10.png",
    "bills": "image17.png",
    "fleet": "image9.png",
    "pm": "image5.png",
    "invoices": "image13.png",
    "jobcal": "image7.png",
    "treemap": "image19.png",
}


def main() -> None:
    RAW.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    for key, name in MAP.items():
        src = MEDIA / name
        if not src.exists():
            raise SystemExit(f"missing {src}")
        shutil.copy2(src, RAW / f"{key}.png")
        print(key, name)
        im = Image.open(src).convert("RGB")
        im = redact(im, 2)
        im = redact(im, 2)
        im = grade(im)
        dest = OUT / f"{key}.webp"
        im.save(dest, "WEBP", quality=82, method=6)
        print(f"  {im.size[0]}x{im.size[1]}  {dest.stat().st_size // 1024}kb")


if __name__ == "__main__":
    main()
