#!/usr/bin/env python3
"""Version voix d'une capsule : cale chaque scène sur ses pistes audio et produit
boards/<id>v.json + voix/<id>/track.wav (piste complète).
Usage : python3 voice_board.py 1.1"""
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
cid = sys.argv[1]
VD = os.path.join(HERE, "voix", cid)
spec = json.load(open(os.path.join(VD, "spec.json"), encoding="utf-8"))
b = json.load(open(os.path.join(HERE, "boards", cid + ".json"), encoding="utf-8"))

def dur(f):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", os.path.join(VD, f)]).decode())

PAD0, GAP, TAIL = 0.5, 0.6, 0.9
t0 = 0.0; inputs = []
for i, s in enumerate(b["scenes"]):
    clips = spec[str(i)]
    at = PAD0; cl = []
    for c in clips:
        if c.get("after_pause"): at += c["after_pause"]
        d = dur(c["file"])
        cl.append({"file": c["file"], "at": round(at, 2), "dur": round(d, 2), "text": c["text"]})
        at += d + GAP
    s["clips"] = cl
    s["dur"] = round(max(at - GAP + TAIL, 3.0), 2)
    if s["kind"] == "quiz" and len(cl) > 1: s["reveal"] = cl[1]["at"] - 0.3
    if s["kind"] == "mozi" and len(cl) > 1: s["bubbleAt"] = cl[1]["at"] - 0.4
    for c in cl: inputs.append((t0 + c["at"], c["file"]))
    t0 += s["dur"]
b["total"] = round(t0, 2); b["voiced"] = True
json.dump(b, open(os.path.join(HERE, "boards", cid + "v.json"), "w"), ensure_ascii=False, indent=1)
# piste audio complète
args = ["ffmpeg", "-y", "-loglevel", "error"]
for _, f in inputs: args += ["-i", os.path.join(VD, f)]
fl = "".join("[%d:a]aresample=48000,adelay=%d|%d[a%d];" % (k, int(t * 1000), int(t * 1000), k) for k, (t, _) in enumerate(inputs))
fl += "".join("[a%d]" % k for k in range(len(inputs))) + "amix=inputs=%d:normalize=0,apad=whole_dur=%.2f[out]" % (len(inputs), t0)
args += ["-filter_complex", fl, "-map", "[out]", "-ac", "2", os.path.join(VD, "track.wav")]
subprocess.check_call(args)
print("board", cid + "v", "durée %.1f s" % t0)
