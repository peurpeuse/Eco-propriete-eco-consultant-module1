"""Construit timing.json : temps globaux de chaque mot (intro + décalage de chaque segment)."""
import json, sys
FPS = 30
INTRO = 4.5
OUTRO = 6.0
words = json.load(open('words.json'))
# Décalages réels des segments dans la vidéo HeyGen (mesurés après rendu) ; sinon théoriques
try:
    offs = json.load(open('offsets.json'))
except FileNotFoundError:
    offs, t = [], 0.0
    for s in words:
        offs.append(t); t += s['dur']
    offs.append(t)
segs = []
for i, s in enumerate(words):
    o = INTRO + offs[i]
    segs.append({"start": o, "end": INTRO + offs[i + 1],
                 "words": [{"t": w['t'], "s": round(o + w['s'], 3), "e": round(o + w['e'], 3)} for w in s['words']]})
audio_end = INTRO + offs[-1]
json.dump({"fps": FPS, "intro": INTRO, "audioEnd": audio_end, "total": audio_end + OUTRO,
           "frames": int(round((audio_end + OUTRO) * FPS)), "segs": segs,
           "avatarFrames": len([f for f in __import__('os').listdir('public/frames') if f.endswith('.jpg')]),
           "avatarFocus": "62% 8%"},
          open('src/timing.json', 'w'), ensure_ascii=False)
print("total", round(audio_end + OUTRO, 2), "s")
