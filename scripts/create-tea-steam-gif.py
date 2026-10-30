"""Render the requested steam-only GIF. Requires Pillow; no build-time dependency."""

from math import cos, pi, sin
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public" / "assets"
SIZE = (768, 512)
FRAME_COUNT = 48
FRAME_MS = 100


def draw_steam(size, phase):
    """Periodic curves carry wisps upward, fading out before the canvas edge."""
    width, height = size
    glow = Image.new("RGBA", size)
    pencil = Image.new("RGBA", size)
    glow_draw = ImageDraw.Draw(glow)
    pencil_draw = ImageDraw.Draw(pencil)
    cups = ((.454, .293, .23, 28), (.587, .328, .205, 25))

    for cup_index, (origin_x, origin_y, rise, amplitude) in enumerate(cups):
        for strand in range(2):
            strand_phase = phase + strand * 1.9 + cup_index * .9
            previous = None
            for step in range(101):
                t = step / 100
                sway = (sin(8 * t - strand_phase) - sin(-strand_phase)) * amplitude * t
                texture = sin(37 * t + strand * 2) * .5 * t
                point = (
                    width * origin_x + sway + texture + strand * 7 * sin(pi * t),
                    height * (origin_y - rise * t),
                )
                if previous is not None:
                    fade = sin(pi * t) ** .45 * (1 - t) ** .25
                    pulse = .8 + .2 * cos(phase - 4 * t + strand)
                    opacity = int(220 * fade * pulse * (1 if strand == 0 else .7))
                    glow_draw.line((previous, point), fill=(193, 171, 143, int(opacity * .4)), width=12)
                    pencil_draw.line((previous, point), fill=(156, 135, 112, opacity), width=5)
                previous = point

    glow = glow.filter(ImageFilter.GaussianBlur(3))
    return Image.alpha_composite(glow, pencil)


def build_animation():
    source = Image.open(ASSETS / "chai-steam-base.png").convert("RGBA")
    background = Image.new("RGBA", source.size, "white")
    background.alpha_composite(source)
    frames = []
    for index in range(FRAME_COUNT):
        steam = draw_steam(source.size, 2 * pi * index / FRAME_COUNT)
        frame = Image.alpha_composite(background, steam)
        frames.append(frame.convert("RGB").resize(SIZE, Image.LANCZOS))

    # One palette for every frame keeps all static artwork pixels identical.
    atlas = Image.new("RGB", (SIZE[0], SIZE[1] + 24), "white")
    atlas.paste(frames[0], (0, 0))
    swatches = ImageDraw.Draw(atlas)
    for index in range(16):
        opacity = index / 15 * .65
        color = tuple(round(255 * (1 - opacity) + channel * opacity) for channel in (174, 154, 131))
        swatches.rectangle((index * 48, SIZE[1], (index + 1) * 48 - 1, SIZE[1] + 23), fill=color)
    palette = atlas.quantize(colors=256, method=Image.MEDIANCUT)
    colors = palette.getpalette()
    # Collapse near-white palette entries so GIF quantization leaves no gray box.
    for index in range(256):
        if min(colors[index * 3:index * 3 + 3]) >= 248:
            colors[index * 3:index * 3 + 3] = [255, 255, 255]
    palette.putpalette(colors)
    indexed_frames = [frame.quantize(palette=palette, dither=Image.NONE) for frame in frames]
    output = ASSETS / "chai-steam.gif"
    indexed_frames[0].save(
        output,
        save_all=True,
        append_images=indexed_frames[1:],
        duration=FRAME_MS,
        loop=0,
        disposal=1,
        optimize=True,
    )
    print(f"Saved {output}: {FRAME_COUNT} frames, {FRAME_COUNT * FRAME_MS / 1000:.1f}s loop, {output.stat().st_size:,} bytes")


if __name__ == "__main__":
    build_animation()
