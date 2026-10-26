"""Met la page de validation au format chapitre (gabarit 15 écrans).
Pour chaque capsule qui a un chap_<id>.json : le script devient les 15 écrans (un passage = un écran, éditable),
le quiz devient les 2 cartes, l'accroche devient la réplique de Mozi, les points à valider deviennent les notes.
Les avis déjà donnés restent attachés à l'élément (même identifiant de capsule).
Usage : python3 chapters_to_data.py
"""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
CON = os.path.join(os.path.dirname(HERE), "content")
P = os.path.join(HERE, "data.json")
D = json.load(open(P))
n = 0
for it in D["items"]:
    if it.get("kind") != "capsule":
        continue
    f = os.path.join(CON, "M%s" % it["mod"], "chap_%s.json" % it["id"])
    if not os.path.exists(f):
        continue
    ch = json.load(open(f))
    sc = ch["screens"]
    it["title"] = ch["title"]
    it["capsule_title"] = ch.get("capsule_title", it.get("title"))
    it["objective"] = ch.get("objective", it.get("objective"))
    it["hook"] = "Mozi : « %s »" % ch["mozi"]["line"]
    it["script"] = [[s["tc"], s["voice"], "Écran %d · %s%s" % (s["n"], s["title"], (" · Source : " + s["source"]) if s.get("source") else "")] for s in sc]
    words = sum(len(re.findall(r"\w+", s["voice"])) for s in sc)
    it["words"] = words
    it["min"] = 4.5
    q = sc[8]
    it["quiz"] = [[q["card1"]["question"], q["card1"]["options"][q["card1"]["answer"]]], [q["card2"]["question"], q["card2"]["answer"]]]
    it["points"] = " · ".join(ch.get("open_points", []))
    it["chapter"] = {"duration": ch.get("duration", "4:30"), "mozi": ch["mozi"]["line"], "screens": len(sc),
                     "status": {s["n"]: s.get("voice_status", "proposition") for s in sc}}
    it["video"] = False
    it.pop("vsrc", None)
    it.pop("vstarts", None)
    n += 1
json.dump(D, open(P, "w"), ensure_ascii=False, separators=(",", ":"))
print("chapitres reportés dans la page de validation :", n)
