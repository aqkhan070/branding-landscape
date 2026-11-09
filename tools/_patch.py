from PIL import Image, ImageDraw, ImageFont

FONT = r"C:\Windows\Fonts\segoeui.ttf"


def font(h):
    try:
        return ImageFont.truetype(FONT, max(8, min(15, int(h * 0.9))))
    except OSError:
        return ImageFont.load_default()


def paint(im, box, label="$0.00", fill=(26, 86, 48), bg=None):
    draw = ImageDraw.Draw(im)
    x0, y0, x1, y1 = [int(v) for v in box]
    px = im.load()
    if bg is None:
        sx = max(0, x0 - 4)
        sy = max(0, min(im.height - 1, (y0 + y1) // 2))
        bg = px[sx, sy]
    draw.rounded_rectangle((x0, y0, x1, y1), radius=3, fill=bg)
    f = font(max(10, y1 - y0))
    draw.text((x0 + 3, y0), label, font=f, fill=fill)


def cover_bar_labels(im):
    """Paint $0.00 over labels sitting at the right end of horizontal chart bars."""
    px = im.load()
    W, H = im.size
    draw = ImageDraw.Draw(im)
    bands = []
    y = int(H * 0.28)
    while y < int(H * 0.92):
        xs = []
        for x in range(int(W * 0.45), W - 8):
            r, g, b = px[x, y]
            if 70 < g < 220 and 40 < r < 210 and b < 150 and g > r - 8 and g > b + 20:
                xs.append(x)
        if len(xs) > 80:
            bands.append((y, min(xs), max(xs)))
        y += 1
    # collapse consecutive rows
    groups = []
    for y, x0, x1 in bands:
        if groups and y - groups[-1]["y1"] <= 2 and abs(x1 - groups[-1]["x1"]) < 40:
            groups[-1]["y1"] = y
            groups[-1]["x1"] = max(groups[-1]["x1"], x1)
            groups[-1]["x0"] = min(groups[-1]["x0"], x0)
        else:
            groups.append({"y0": y, "y1": y, "x0": x0, "x1": x1})
    for g in groups:
        h = g["y1"] - g["y0"]
        if h < 6 or h > 22:
            continue
        x1 = g["x1"]
        y0, y1 = g["y0"], g["y1"] + 1
        sample = px[max(0, x1 - 6), (y0 + y1) // 2]
        # cover 54px to the right of the bar (the $9.2M / $17.8M label)
        box = (x1 - 6, y0 - 1, min(W - 4, x1 + 54), y1 + 2)
        draw.rectangle(box, fill=sample)
        f = font(max(10, h))
        draw.text((x1 + 2, y0 - 1), "$0.00", font=f, fill=(40, 70, 30))
        print("bar", box)


def main():
    est = Image.open(r"d:\Earthco\earthco-exhibit\public\modules\estimator.webp").convert("RGB")
    paint(est, (1138, 416, 1174, 434), "$0.00")
    paint(est, (1086, 599, 1126, 618), "$0.00")
    est.save(r"d:\Earthco\earthco-exhibit\public\modules\estimator.webp", "WEBP", quality=84, method=6)

    rt = Image.open(r"d:\Earthco\earthco-exhibit\public\modules\routes.webp").convert("RGB")
    paint(rt, (155, 80, 210, 102), "$0.00", fill=(245, 247, 236), bg=(90, 102, 18))
    paint(rt, (578, 82, 618, 100), "$0.00", fill=(26, 86, 48), bg=(255, 255, 255))
    paint(rt, (758, 84, 802, 100), "$0.00", fill=(26, 86, 48), bg=(255, 255, 255))
    paint(rt, (1288, 700, 1366, 726), "$0.00", fill=(180, 90, 40), bg=(255, 255, 255))
    rt.save(r"d:\Earthco\earthco-exhibit\public\modules\routes.webp", "WEBP", quality=84, method=6)

    crm = Image.open(r"d:\Earthco\earthco-exhibit\public\modules\crm.webp").convert("RGB")
    cover_bar_labels(crm)
    paint(crm, (1024, 636, 1080, 656), "$0.00", fill=(26, 86, 48), bg=(255, 255, 255))
    crm.save(r"d:\Earthco\earthco-exhibit\public\modules\crm.webp", "WEBP", quality=84, method=6)
    pl = Image.open(r"d:\Earthco\earthco-exhibit\public\modules\pipelines.webp").convert("RGB")
    paint(pl, (0, 72, 78, 175), "", fill=(90, 100, 95), bg=(248, 249, 247))
    pl.save(r"d:\Earthco\earthco-exhibit\public\modules\pipelines.webp", "WEBP", quality=84, method=6)

    rt = Image.open(r"d:\Earthco\earthco-exhibit\public\modules\routes.webp").convert("RGB")
    paint(rt, (1284, 696, 1372, 731), "$0.00", fill=(180, 90, 40), bg=(255, 255, 255))
    rt.save(r"d:\Earthco\earthco-exhibit\public\modules\routes.webp", "WEBP", quality=84, method=6)
    print("patched")


if __name__ == "__main__":
    main()
