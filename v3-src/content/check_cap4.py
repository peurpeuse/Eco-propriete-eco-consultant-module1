#!/usr/bin/env python3
"""Validateur des fiches capsule v4 (format : vidéo ≤ 4 min 30 → quiz flash 3 questions → ressource → exercice → livrable).
Usage : python3 check_cap4.py v4/M1/cap_1.10.json [...]   (sans argument : tous les fichiers v4/*/cap_*.json)"""
import json, sys, re, glob
L = lambda s: len(s or "")
W = lambda t: len(re.findall(r"\w+", t or ""))
def mcq(q, i, e):
    o = q.get("options", []); w = q.get("whys", [])
    if not q.get("question") or L(q["question"]) > 240: e.append(f"quiz[{i}] question manquante ou > 240 car.")
    if not 3 <= len(o) <= 4: e.append(f"quiz[{i}] 3 ou 4 options")
    if any(L(x) > 150 for x in o): e.append(f"quiz[{i}] option > 150 car.")
    a = q.get("answer")
    if not isinstance(a, int) or not 0 <= a < len(o): e.append(f"quiz[{i}] answer = index de la bonne option")
    if len(w) != len(o) or any(not 15 <= L(x) <= 260 for x in w): e.append(f"quiz[{i}] whys : 1 par option, 15-260 car.")
    if not q.get("fb_title") or L(q.get("fb_title")) > 80: e.append(f"quiz[{i}] fb_title ≤ 80")
    if not 40 <= L(q.get("fb_text")) <= 450: e.append(f"quiz[{i}] fb_text 40-450")
def check(d, plan):
    e = []
    p = plan.get(d.get("id"))
    if not p: return ["id absent du PLAN.json"]
    for k in ("module", "section", "etape", "parcours", "prio", "ia"):
        if d.get(k) != p.get(k): e.append(f"{k} doit valoir {p.get(k)!r} (PLAN.json)")
    if d.get("title") != p["title"]: e.append("title : reprendre exactement le titre du PLAN.json")
    if not 30 <= L(d.get("objective")) <= 220: e.append("objective 30-220 car. (verbe d'action observable)")
    v = d.get("video") or {}
    if v.get("duration") != "4:30" or not 60 <= L(v.get("pitch")) <= 400: e.append("video : {duration:'4:30', pitch 60-400 car.}")
    qz = (d.get("quiz") or {}).get("questions") or []
    if len(qz) != 3: e.append(f"quiz : {len(qz)} questions (exactement 3)")
    for i, q in enumerate(qz): mcq(q, i, e)
    if len(qz) == 3 and len({q.get('answer') for q in qz}) < 2: e.append("quiz : varie la position des bonnes réponses")
    r = d.get("resource") or {}
    if not r.get("title"): e.append("resource.title manquant")
    secs = r.get("sections") or []
    if not 3 <= len(secs) <= 7: e.append(f"resource.sections : {len(secs)} (3-7)")
    rw = W(r.get("intro"))
    for j, s in enumerate(secs):
        t = s.get("type")
        if t not in ("list", "checklist", "steps", "table", "text", "formula"): e.append(f"resource.sections[{j}].type invalide")
        if not s.get("heading"): e.append(f"resource.sections[{j}].heading manquant")
        if t in ("list", "checklist", "steps"):
            it = s.get("items") or []
            if not 2 <= len(it) <= 12: e.append(f"resource.sections[{j}].items 2-12")
            rw += sum(W(x) for x in it)
        elif t == "table":
            h = s.get("headers") or []; rows = s.get("rows") or []
            if not 2 <= len(h) <= 6 or not 2 <= len(rows) <= 14 or any(len(x) != len(h) for x in rows): e.append(f"resource.sections[{j}] table : headers 2-6, rows 2-14, même largeur")
            rw += sum(W(" ".join(map(str, x))) for x in rows)
        else:
            if L(s.get("text")) < 30: e.append(f"resource.sections[{j}].text trop court")
            rw += W(s.get("text"))
    if rw < 180: e.append(f"resource : {rw} mots (≥ 180, utilisable telle quelle)")
    x = d.get("exercise") or {}
    for k in ("title", "context", "steps", "expected"):
        if not x.get(k): e.append(f"exercise.{k} manquant")
    if not 3 <= len(x.get("steps") or []) <= 7: e.append("exercise.steps 3-7")
    if L(x.get("expected")) < 150: e.append("exercise.expected ≥ 150 car. (corrigé ou exemple attendu)")
    if not isinstance(x.get("duration_min"), int) or not 10 <= x["duration_min"] <= 90: e.append("exercise.duration_min entier 10-90")
    if d.get("ia"):
        pr = x.get("ia_prompt") or {}
        if L(pr.get("prompt")) < 250: e.append("exercise.ia_prompt.prompt ≥ 250 car. (capsule IA)")
        if len(pr.get("guardrails") or []) < 2: e.append("exercise.ia_prompt.guardrails ≥ 2")
    dl = d.get("deliverable") or {}
    for k in ("title", "format", "criteria"):
        if not dl.get(k): e.append(f"deliverable.{k} manquant")
    if not 3 <= len(dl.get("criteria") or []) <= 6: e.append("deliverable.criteria 3-6")
    if not d.get("sources"): e.append("sources manquantes")
    txt = json.dumps(d, ensure_ascii=False)
    if re.search(r"\bSeb\b", txt): e.append("« Seb » interdit : écrire « Sébastien Paumier »")
    if re.search(r"(?<!-)\bvous\b", txt.replace("« ", "").replace(" »", "")) and "vous" not in json.dumps(d.get("quiz"), ensure_ascii=False):
        pass
    if p.get("parcours") == "maison" and "Bernard" in txt and "Garnier" not in txt: e.append("parcours maison : utiliser la maison de Mme Garnier (BIBLE §11)")
    if p.get("parcours") == "appartement" and "Garnier" in txt: e.append("parcours appartement : utiliser l'appartement de M. Bernard")
    return e
if __name__ == "__main__":
    import os
    here = os.path.dirname(os.path.abspath(__file__))
    plan = {c["id"]: c for c in json.load(open(os.path.join(here, "v4", "PLAN.json")))["capsules"]}
    files = sys.argv[1:] or sorted(glob.glob(os.path.join(here, "v4", "*", "cap_*.json")))
    bad = 0
    for f in files:
        try: d = json.load(open(f, encoding="utf-8"))
        except Exception as ex: print("ERREUR", f, "JSON invalide :", ex); bad += 1; continue
        e = check(d, plan)
        print(("OK    " if not e else "ERREUR") + " " + os.path.basename(f))
        for x in e: print("   ", x)
        bad += bool(e)
    sys.exit(1 if bad else 0)
