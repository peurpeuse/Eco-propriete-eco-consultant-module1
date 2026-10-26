"""Complète validation/data.json :
- vsrc / vstarts : vidéo HLS d'une capsule + début réel (s) de chaque segment du script
- applied : corrections déjà reportées dans le contenu, par élément
  {"1.1": {"at": "2026-10-24T18:00:00Z", "refs": {"seg:00:45": "texte appliqué", "q:2": "..."}}}
Usage : python3 augment.py                      (met à jour la vidéo)
        python3 augment.py releve.json          (fusionne {"applied": {...}, "prod": {...}})
- prod : état de mise en production par module {"1": {"at", "status": "en_cours"|"publie", "note"}}
"""
import json, sys, glob, os
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
D = json.load(open(os.path.join(HERE, "data.json")))
# offsets mesurés sur l'audio final (transcription Scribe) pour les vidéos produites
OFFSETS = {"1.1": os.path.join(ROOT, "video11/mg/offsets.json")}
for it in D["items"]:
    if it["kind"] != "capsule":
        continue
    if os.path.exists(os.path.join(ROOT, "content", "M%s" % it["mod"], "chap_%s.json" % it["id"])):
        continue  # format chapitre : la vidéo sera produite au nouveau gabarit
    f = os.path.join(ROOT, "content", "M%s" % it["mod"], "cap_%s.json" % it["id"])
    src = None
    if os.path.exists(f):
        s = json.dumps(json.load(open(f)))
        import re
        m = re.search(r'https://[^"]+\.m3u8', s)
        src = m.group(0) if m else None
    if src:
        it["vsrc"] = src
        if it["id"] in OFFSETS and os.path.exists(OFFSETS[it["id"]]):
            it["vstarts"] = [round(x, 2) for x in json.load(open(OFFSETS[it["id"]]))[: len(it["script"])]]
D.setdefault("applied", {})
D.setdefault("prod", {})
if len(sys.argv) > 1:
    src = json.load(open(sys.argv[1]))
    # format : {"applied": {...}, "prod": {"1": {"at": ISO, "status": "en_cours"|"publie", "note": "..."}}}  (ancien format : applied seul)
    if "applied" in src or "prod" in src:
        for m, v in src.get("prod", {}).items():
            D["prod"][str(m)] = v
        src = src.get("applied", {})
    for k, v in src.items():
        cur = D["applied"].setdefault(k, {"at": v["at"], "refs": {}})
        cur["at"] = max(cur["at"], v["at"])
        cur["refs"].update(v["refs"])
json.dump(D, open(os.path.join(HERE, "data.json"), "w"), ensure_ascii=False, separators=(",", ":"))
print("production :", D["prod"], "· vidéos :", [i["id"] for i in D["items"] if i.get("vsrc")], "· corrections appliquées :", len(D["applied"]))
