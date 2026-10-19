"""Regenerate the committed sharing image (optional tool: Python + Pillow)."""

from pathlib import Path
import math
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
image = Image.new("RGB", (1200, 630))
pixels = image.load()
for y in range(630):
    for x in range(1200):
        glow = math.exp(-(((x - 930) / 420) ** 2 + ((y - 290) / 320) ** 2))
        pixels[x, y] = (int(3 + glow * 8), int(5 + glow * 20), int(9 + glow * 37))

draw = ImageDraw.Draw(image)
for row in range(6):
    for col in range(6):
        x = 740 + col * 74 - row * 20
        y = 150 + row * 49 + col * 12
        draw.polygon([(x, y), (x + 34, y - 12), (x + 65, y),
                      (x + 32, y + 15)], fill="#23364b", outline="#3c5770")
        draw.polygon([(x, y), (x + 32, y + 15), (x + 32, y + 46),
                      (x, y + 31)], fill="#111e2d", outline="#2a3f53")
        draw.polygon([(x + 32, y + 15), (x + 65, y), (x + 65, y + 31),
                      (x + 32, y + 46)], fill="#09111c", outline="#23374c")
        draw.line([(x + 6, y + 7), (x + 26, y + 16)], fill="#70cfff", width=2)

font = lambda size: ImageFont.load_default(size=size)
draw.ellipse((72, 72, 79, 79), fill="#30d158")
draw.text((93, 68), "MOHAMMED SHADAB / PLATFORM ENGINEER", font=font(15), fill="#9cafc5")
draw.text((68, 160), "Infrastructure", font=font(70), fill="#f5f5f7", stroke_width=1)
draw.text((68, 245), "that heals itself.", font=font(70), fill="#c2d9ec", stroke_width=1)
draw.text((72, 365), "DevOps. Automation. AI-augmented operations.", font=font(22), fill="#899bb0")
draw.line((72, 443, 637, 443), fill="#28394b")
for x, value, label in [(72, "100+", "ENVIRONMENTS"), (265, "10+", "VEHICLE PROGRAMS"), (470, "3*", "PATENT PIPELINE")]:
    draw.text((x, 470), value, font=font(34), fill="#dbe8f4")
    draw.text((x, 517), label, font=font(12), fill="#6b839c")
draw.text((72, 580), "mshadab-5.github.io/portfolio", font=font(15), fill="#506981")
image.save(ROOT / "public" / "og-card.png", optimize=True)
