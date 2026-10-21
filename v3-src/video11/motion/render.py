"""Rendu image par image (même principe que Remotion) : Chromium rend chaque frame, ffmpeg encode.
Usage : python3 render.py <frame_début> <frame_fin_exclue> <sortie.mp4|dossier_png> [step]"""
import sys, subprocess, os, time
from playwright.sync_api import sync_playwright
a, b, out = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3]
step = int(sys.argv[4]) if len(sys.argv) > 4 else 1
here = os.path.dirname(os.path.abspath(__file__))
stills = not out.endswith('.mp4')
with sync_playwright() as p:
    br = p.chromium.launch(args=["--allow-file-access-from-files", "--disable-gpu", "--font-render-hinting=none"])
    pg = br.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=1)
    pg.goto("file://" + os.path.join(here, "public", "index.html"))
    pg.wait_for_function("window.__setFrame !== undefined")
    errs = pg.evaluate("window.__setFrame(0)")
    if errs:
        print("ANCRES INTROUVABLES:", pg.evaluate("window.__anchorErrors")); sys.exit(2)
    enc = None
    if stills:
        os.makedirs(out, exist_ok=True)
    else:
        enc = subprocess.Popen(["ffmpeg", "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", "30", "-c:v", "mjpeg", "-i", "-",
                                "-c:v", "libx264", "-preset", "veryfast", "-crf", "17", "-pix_fmt", "yuv420p", out], stdin=subprocess.PIPE)
    t0 = time.time()
    for f in range(a, b, step):
        pg.evaluate(f"window.__setFrame({f})")
        if stills:
            pg.screenshot(path=os.path.join(out, f"f{f:05d}.jpg"), type="jpeg", quality=88)
        else:
            enc.stdin.write(pg.screenshot(type="jpeg", quality=93))
        if (f - a) % 300 == 0:
            print(f"{f} ({(f - a + 1) / (time.time() - t0 + 1e-9):.1f} fps)", flush=True)
    bad = pg.evaluate("Array.from(new Set(window.__anchorErrors))")
    if bad: print("ANCRES INTROUVABLES:", bad)
    if enc:
        enc.stdin.close(); enc.wait()
    br.close()
print("ok", out)
