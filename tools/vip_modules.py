"""Crop, sanitize, and grade EarthCo module screenshots for the exhibit."""
from __future__ import annotations

import re
from pathlib import Path

import pytesseract
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

ROOT = Path(r"d:\Earthco\earthco-exhibit")
RAW = ROOT / "tools" / "modules-raw"
OUT = ROOT / "public" / "modules"

MAP = {
    "dashboard": "img-00.png",
    "crm": "img-01.png",
    "activities": "img-02.png",
    "pipelines": "img-03.png",
    "scorecard": "img-04.png",
    "estimator": "img-05.png",
    "kpis": "img-06.png",
    "goals": "img-07.png",
    "sr": "img-08.png",
    "estimates": "img-09.png",
    "punchlist": "img-10.png",
    "po": "img-11.png",
    "routes": "img-12.png",
    "bills": "img-13.png",
    "pm": "img-18.png",
    "fleet": "img-15.png",
    "invoices": "img-16.png",
    "jobcal": "img-17.png",
    "treemap": "img-19.png",
}

ZERO = re.compile(r"^\$?0+(?:\.0+)?$")
SR = re.compile(r"^S?\$?20\d{6,}$", re.I)
YEARISH = re.compile(r"^(?:19|20)\d{2}$")
DATEFRAG = re.compile(r"^\d{1,2},20\d{2}$")
COMMA_MONEY = re.compile(r"^-?\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?$")
K_MONEY = re.compile(r"^-?\$?\d+(?:\.\d+)?[kKmMbB]$")
SLASH_K = re.compile(r"\d(?:\.\d+)?k/\d", re.I)
DOLLARISH = re.compile(r"[$sS]\d")
EMAIL = re.compile(r"[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}", re.I)
SQFT = re.compile(r"sq", re.I)
PCT = re.compile(r"%")

FONT_PATH = r"C:\Windows\Fonts\segoeui.ttf"


def clean(text: str) -> str:
    return text.strip().replace(" ", "").replace("US$", "$")


def is_email(text: str) -> bool:
    t = text.strip()
    if "@" not in t and "gmail" not in t.lower():
        return False
    if EMAIL.search(t) or "@gmail" in t.lower() or "@yahoo" in t.lower() or "@earthco" in t.lower():
        if "demo@earthco.co" in t.lower():
            return False
        return True
    return False


def is_money(text: str) -> bool:
    t = clean(text)
    if not t or ZERO.match(t):
        return False
    if SR.match(t) or YEARISH.match(t) or DATEFRAG.match(t):
        return False
    if t.upper().startswith("S20"):
        return False
    if SQFT.search(text) or PCT.search(text):
        return False
    if "/mo" in t.lower():
        return any(ch.isdigit() for ch in t)
    if SLASH_K.search(t):
        return True
    if K_MONEY.match(t):
        return True
    if COMMA_MONEY.match(t.lstrip("-$sS")):
        return True
    if DOLLARISH.search(t) and any(ch.isdigit() for ch in t):
        return True
    if t.startswith("$") and any(ch.isdigit() for ch in t):
        return True
    # OCR reads $273,613 as s273,613
    if re.match(r"^[sS]-?\d{1,3}(?:,\d{3})+", t):
        return True
    return False


def sample_bg(im: Image.Image, x: int, y: int, w: int, h: int):
    W, H = im.size
    px = im.convert("RGB").load()
    pts = [
        (max(0, min(W - 1, x - 3)), max(0, min(H - 1, y + h // 2))),
        (max(0, min(W - 1, x + w + 3)), max(0, min(H - 1, y + h // 2))),
        (max(0, min(W - 1, x + w // 2)), max(0, min(H - 1, y - 3))),
    ]
    cols = [px[a, b] for a, b in pts]
    return tuple(sum(c[i] for c in cols) // len(cols) for i in range(3))


def font_for(h: int):
    size = max(8, min(16, int(h * 0.88)))
    try:
        return ImageFont.truetype(FONT_PATH, size)
    except OSError:
        return ImageFont.load_default()


def ocr_words(im: Image.Image, scale: int):
    big = im.resize((im.width * scale, im.height * scale), Image.Resampling.LANCZOS)
    data = pytesseract.image_to_data(big, output_type=pytesseract.Output.DICT, config="--psm 6")
    words = []
    n = len(data["text"])
    for i in range(n):
        raw = data["text"][i].strip()
        if not raw:
            continue
        try:
            conf = float(data["conf"][i])
        except (TypeError, ValueError):
            conf = 0
        words.append(
            {
                "text": raw,
                "x": data["left"][i] / scale,
                "y": data["top"][i] / scale,
                "w": data["width"][i] / scale,
                "h": data["height"][i] / scale,
                "conf": conf,
            }
        )
    words.sort(key=lambda w: (round(w["y"] / 6), w["x"]))
    return words


def merge_line(words):
    if not words:
        return []
    merged = [dict(words[0])]
    for w in words[1:]:
        prev = merged[-1]
        same_line = abs(w["y"] - prev["y"]) < max(8, prev["h"] * 0.55)
        gap = w["x"] - (prev["x"] + prev["w"])
        close = -4 < gap < 14
        combo = prev["text"] + w["text"]
        if same_line and close and (is_money(combo) or is_email(combo) or prev["text"] in {"$", "US$", "-", "-$"} or w["text"].startswith("/")):
            prev["w"] = (w["x"] + w["w"]) - prev["x"]
            prev["h"] = max(prev["h"], w["h"])
            prev["text"] = (prev["text"] + " " + w["text"]).strip()
        else:
            merged.append(dict(w))
    return merged


def is_right_amount(word, width: int) -> bool:
    if word["x"] < width * 0.78:
        return False
    t = clean(word["text"])
    if YEARISH.match(t) or PCT.search(word["text"]):
        return False
    if re.fullmatch(r"\d{3,6}", t):
        return True
    if re.fullmatch(r"\d{2,4}[a-z]", t, re.I):
        return True
    if re.fullmatch(r"\$?\d{1,3}(?:,\d{3})+(?:\.\d{2})?", t):
        return True
    return False


def paint_token(draw, im, w, money=True):
    x, y, bw, bh = int(w["x"]), int(w["y"]), int(w["w"]), int(w["h"])
    if bw < 5 or bh < 5:
        return
    pad_x, pad_y = 6, 3
    box = (x - pad_x, y - pad_y, x + bw + pad_x, y + bh + pad_y)
    bg = sample_bg(im, x, y, bw, bh)
    draw.rounded_rectangle(box, radius=3, fill=bg)
    label = "$0.00" if money else "demo@earthco.co"
    if bh >= 9 and bw >= 28:
        f = font_for(bh)
        fill = (26, 86, 48) if money else (90, 100, 95)
        tw = draw.textlength(label, font=f)
        if tw > bw + 8:
            label = "$0" if money else "demo"
            tw = draw.textlength(label, font=f)
        tx = x + max(0, (bw - tw) / 2)
        draw.text((tx, y - 1), label, font=f, fill=fill)


def redact(im: Image.Image, scale: int) -> Image.Image:
    rgb = im.convert("RGB")
    draw = ImageDraw.Draw(rgb)
    words = merge_line(ocr_words(rgb, scale))
    hits = 0
    for w in words:
        text = w["text"]
        money = is_money(text) or is_right_amount(w, rgb.width)
        mail = is_email(text)
        if not money and not mail:
            continue
        paint_token(draw, rgb, w, money=not mail)
        hits += 1
    print(f"    redacted {hits} tokens @ {scale}x")
    return rgb


def cover_green_chip_money(im: Image.Image) -> Image.Image:
    """Hide $ amounts on dark-green RM pills (white-on-green OCR fails)."""
    rgb = im.convert("RGB")
    px = rgb.load()
    W, H = rgb.size
    y0, y1 = int(H * 0.07), int(H * 0.20)
    cols = []
    span = max(1, y1 - y0)
    for x in range(W):
        gcount = 0
        for y in range(y0, y1):
            r, g, b = px[x, y]
            if g > 72 and g > r + 18 and g > b + 18 and r < 95:
                gcount += 1
        if gcount > span * 0.38:
            cols.append(x)
    if not cols:
        return rgb
    ranges = []
    start = cols[0]
    prev = cols[0]
    for x in cols[1:]:
        if x - prev > 4:
            ranges.append((start, prev))
            start = x
        prev = x
    ranges.append((start, prev))
    draw = ImageDraw.Draw(rgb)
    for x0, x1 in ranges:
        if x1 - x0 < 70:
            continue
        cover_from = x0 + int((x1 - x0) * 0.55)
        gy = y0 + (y1 - y0) // 2
        fill = px[min(W - 1, cover_from + 4), gy]
        draw.rounded_rectangle((cover_from, y0 + 4, x1 - 2, y1 - 4), radius=8, fill=fill)
        f = font_for(14)
        draw.text((cover_from + 6, gy - 7), "$0.00", font=f, fill=(245, 247, 236))
    return rgb


def cover_yellow_on_green(im: Image.Image) -> Image.Image:
    """Hide chart labels like $9.2M sitting on green bars."""
    rgb = im.convert("RGB")
    px = rgb.load()
    W, H = rgb.size
    hits = []
    for y in range(int(H * 0.28), int(H * 0.92)):
        for x in range(int(W * 0.48), W - 1):
            r, g, b = px[x, y]
            if r > 170 and g > 150 and b < 90 and g > b + 70:
                hits.append((x, y))
    if len(hits) < 8:
        return rgb
    xs = [p[0] for p in hits]
    ys = [p[1] for p in hits]
    # cluster by y into bands
    bands = []
    row = [hits[0]]
    hits.sort(key=lambda p: (p[1], p[0]))
    for p in hits[1:]:
        if p[1] - row[-1][1] <= 3:
            row.append(p)
        else:
            bands.append(row)
            row = [p]
    bands.append(row)
    draw = ImageDraw.Draw(rgb)
    for row in bands:
        if len(row) < 6:
            continue
        x0 = min(p[0] for p in row) - 4
        x1 = max(p[0] for p in row) + 8
        y0 = min(p[1] for p in row) - 3
        y1 = max(p[1] for p in row) + 4
        sample = px[max(0, x0 - 6), (y0 + y1) // 2]
        draw.rectangle((x0, y0, x1, y1), fill=sample)
        if x1 - x0 > 28:
            f = font_for(max(8, y1 - y0))
            draw.text((x0, y0 - 1), "$0.00", font=f, fill=(40, 90, 50))
    return rgb


def crop_chrome(im: Image.Image, key: str) -> Image.Image:
    w, h = im.size
    if h > w:
        left = int(w * 0.142)
        top = int(h * 0.046)
        return im.crop((left, top, w, h))
    left = int(w * 0.142)
    top = int(h * 0.074)
    return im.crop((left, top, w, h))


def grade(im: Image.Image) -> Image.Image:
    im = ImageEnhance.Contrast(im).enhance(1.06)
    im = ImageEnhance.Color(im).enhance(1.08)
    im = ImageEnhance.Sharpness(im).enhance(1.18)
    im = ImageEnhance.Brightness(im).enhance(1.02)
    return im.filter(ImageFilter.UnsharpMask(radius=1.0, percent=70, threshold=4))


def main():
    import sys

    only = set(sys.argv[1:]) if len(sys.argv) > 1 else None
    OUT.mkdir(parents=True, exist_ok=True)
    for key, name in MAP.items():
        if only and key not in only:
            continue
        src = RAW / name
        print(key)
        im = Image.open(src)
        im = crop_chrome(im, key)
        scale = 3 if key == "kpis" else 2
        im = redact(im, scale)
        im = redact(im, 2)
        if key == "routes":
            im = cover_green_chip_money(im)
        if key in {"crm", "kpis"}:
            im = cover_yellow_on_green(im)
        im = grade(im)
        dest = OUT / f"{key}.webp"
        im.save(dest, "WEBP", quality=82, method=6)
        print(f"  {im.size}  {dest.stat().st_size // 1024}kb")


if __name__ == "__main__":
    main()
