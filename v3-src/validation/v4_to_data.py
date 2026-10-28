"""Régénère validation/data.json depuis le parcours construit (build/site/data.js) : prérequis, modules 1 à 3 du nouveau plan,
modules 4 et 5 inchangés. Garde « site », « applied » et « prod ». Usage : python3 v4_to_data.py (après build.py)."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.join(os.path.dirname(HERE), "build", "site", "data.js")
C = json.loads(open(SITE, encoding="utf-8").read().split("=", 1)[1].rstrip().rstrip(";"))
P = os.path.join(HERE, "data.json")
old = json.load(open(P))
COL = {0: "#8E1B3A", 1: "#E2231A", 2: "#F08A00", 3: "#E8B900", 4: "#8CC63F", 5: "#2FA84F"}
W = lambda t: len(re.findall(r"\w+", t or ""))
def experts(c):
    t = json.dumps(c, ensure_ascii=False)
    e = []
    if re.search(r"\b(loi|décret|Code|article|art\.|Hoguet|RGPD|CNIL|DGCCRF|mandat)\b", t): e.append("JUR")
    if re.search(r"\b(DPE|diagnostic|audit|kWh|thermique|isolation|amiante|plomb|Carrez)\b", t): e.append("TECH")
    if c.get("chapter"): e.append("VID")
    return e or ["PEDA"]
items = []
for m in C["modules"]:
    mid = m["id"]; code = "P" if mid == 0 else "M%d" % mid
    k = m.get("case") or {}
    items.append({"id": code, "kind": "module", "mod": mid, "color": COL[mid], "title": m["title"], "entry": m.get("entry", ""), "exit": m.get("exit", ""),
                  "capsules": [[c["id"], c["title"], bool(c.get("ia"))] for c in m["capsules"]],
                  "case": {"title": k.get("title", ""), "min": k.get("duration_min", 0), "brief": k.get("brief", ""), "deliverable": k.get("deliverable", ""),
                           "criteria": [[x.get("label", ""), x.get("points", "")] for x in k.get("criteria", [])]},
                  "reminders": [[t, (m.get("reminders") or {}).get(t, {}).get("subject", ""), ""] for t in ("J1", "J7", "J30")]})
    for c in m["capsules"]:
        ch = c.get("chapter"); v = c.get("video") or {}
        it = {"id": c["id"], "kind": "capsule", "mod": mid, "color": COL[mid], "title": ch["title"] if ch else c["title"], "capsule_title": c["title"],
              "ia": bool(c.get("ia")), "objective": c.get("objective", ""), "video": False, "min": 4.5,
              "section": c.get("section", ""), "etape": c.get("etape", ""), "parcours": c.get("parcours"), "prio": bool(c.get("prio")), "v4": bool(c.get("v4")),
              "quiz": [[q["question"], q["options"][q["answer"]]] for q in c["quiz"]["questions"]],
              "fiche": [c["resource"]["title"], [s.get("heading", "") for s in c["resource"].get("sections", [])]],
              "exo": [c["exercise"]["title"], c["exercise"].get("duration_min", 0), c["exercise"].get("context", ""), c["exercise"].get("steps", [])],
              "livrable": [c["deliverable"]["title"], c["deliverable"].get("format", ""), c["deliverable"].get("criteria", [])],
              "points": " · ".join((ch or {}).get("open_points", []) + c.get("open_points", [])), "experts": experts(c)}
        if ch:
            sc = ch["screens"]
            it["hook"] = "Mozi : « %s »" % ch["mozi"]["line"]
            it["script"] = [[s["tc"], s["voice"], "Écran %d · %s%s" % (s["n"], s["title"], (" · Source : " + s["source"]) if s.get("source") else "")] for s in sc]
            it["words"] = sum(W(s["voice"]) for s in sc)
            it["chapter"] = {"duration": ch.get("duration", "4:30"), "mozi": ch["mozi"]["line"], "screens": len(sc), "status": {s["n"]: s.get("voice_status", "proposition") for s in sc}}
        else:
            it["hook"] = v.get("pitch") or v.get("hook") or ""
            it["script"] = [[s.get("tc", ""), s.get("voice", ""), s.get("screen", "")] for s in v.get("segments", [])] or [["", v.get("pitch", ""), "Vidéo à produire (4 min 30 maximum)"]]
            it["words"] = sum(W(s[1]) for s in it["script"])
        items.append(it)
D = {"site": old.get("site", "https://eco-consultant-parcours.vercel.app"), "items": items, "applied": old.get("applied", {}), "prod": old.get("prod", {}), "version": "v4"}
json.dump(D, open(P, "w"), ensure_ascii=False, separators=(",", ":"))
print("validation : %d modules, %d capsules (%d avec chapitre)" % (sum(1 for i in items if i["kind"] == "module"), sum(1 for i in items if i["kind"] == "capsule"), sum(1 for i in items if i.get("chapter"))))
