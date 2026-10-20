#!/usr/bin/env python3
"""Validateur — Éco-Consultant v3 (34 capsules de 8 min).
Usage : python3 check.py M1/cap_1.1.json M1/module.json global.json ..."""
import json, sys, re, os
L = lambda s: len(s or "")
def words(t): return len(re.findall(r"\w+", t or ""))

def mcq(q, i, e, tag):
    o = q.get("options", []); w = q.get("whys", [])
    if not q.get("question") or L(q["question"]) > 220: e.append(f"{tag}[{i}] question manquante ou > 220")
    if not 3 <= len(o) <= 4: e.append(f"{tag}[{i}] 3-4 options")
    if any(L(x) > 140 for x in o): e.append(f"{tag}[{i}] option > 140")
    if len(set(o)) != len(o): e.append(f"{tag}[{i}] options en double")
    a = q.get("answer")
    if not isinstance(a, int) or not 0 <= a < len(o): e.append(f"{tag}[{i}] answer index")
    if len(w) != len(o) or any(not 15 <= L(x) <= 240 for x in w): e.append(f"{tag}[{i}] whys : 1 par option, 15-240 car.")
    if not q.get("fb_title") or L(q.get("fb_title")) > 80: e.append(f"{tag}[{i}] fb_title ≤ 80")
    if L(q.get("fb_text")) < 40 or L(q.get("fb_text")) > 450: e.append(f"{tag}[{i}] fb_text 40-450")

def capsule(d, e, path):
    for k, m in (("id", 5), ("title", 90), ("objective", 200)):
        if not d.get(k): e.append(f"{k} manquant")
        elif L(d[k]) > m: e.append(f"{k} > {m}")
    if not isinstance(d.get("module"), int): e.append("module (int) manquant")
    if not isinstance(d.get("ia"), bool): e.append("ia (bool) manquant")
    v = d.get("video") or {}
    seg = v.get("segments") or []
    if not 6 <= len(seg) <= 14: e.append(f"video.segments : {len(seg)} (6-14)")
    tw = sum(words(s.get("voice")) for s in seg)
    if not 980 <= tw <= 1300: e.append(f"video : {tw} mots de voix (980-1300 pour 8 min)")
    for j, s in enumerate(seg):
        if not re.match(r"^\d\d:\d\d$", str(s.get("tc", ""))): e.append(f"video.segments[{j}].tc mm:ss")
        if L(s.get("screen")) < 20: e.append(f"video.segments[{j}].screen (≥ 20 car. : ce qu'on voit)")
        if L(s.get("onscreen")) > 140: e.append(f"video.segments[{j}].onscreen ≤ 140")
    if L(v.get("hook")) < 20 or L(v.get("hook")) > 200: e.append("video.hook 20-200 (accroche des 20 premières secondes)")
    qz = (d.get("quiz") or {}).get("questions") or []
    if not 4 <= len(qz) <= 5: e.append(f"quiz : {len(qz)} questions (4-5)")
    for i, q in enumerate(qz): mcq(q, i, e, "quiz")
    if qz and len({q.get('answer') for q in qz}) < 2: e.append("quiz : varie la position des bonnes réponses")
    r = d.get("resource") or {}
    if not r.get("title"): e.append("resource.title manquant")
    secs = r.get("sections") or []
    if not 3 <= len(secs) <= 9: e.append(f"resource.sections : {len(secs)} (3-9)")
    rw = 0
    for j, s in enumerate(secs):
        t = s.get("type")
        if t not in ("list", "checklist", "steps", "table", "text", "formula"): e.append(f"resource.sections[{j}].type invalide")
        if not s.get("heading"): e.append(f"resource.sections[{j}].heading manquant")
        if t in ("list", "checklist", "steps"):
            it = s.get("items") or []
            if not 2 <= len(it) <= 14: e.append(f"resource.sections[{j}].items 2-14")
            rw += sum(words(x) for x in it)
        elif t == "table":
            h = s.get("headers") or []; rows = s.get("rows") or []
            if not 2 <= len(h) <= 6 or not 2 <= len(rows) <= 16 or any(len(x) != len(h) for x in rows): e.append(f"resource.sections[{j}] table : headers 2-6, rows 2-16, même largeur")
            rw += sum(words(" ".join(map(str, x))) for x in rows)
        else:
            if L(s.get("text")) < 30: e.append(f"resource.sections[{j}].text trop court")
            rw += words(s.get("text"))
    if rw < 250: e.append(f"resource : {rw} mots (≥ 250 : la ressource doit être utilisable telle quelle)")
    x = d.get("exercise") or {}
    for k in ("title", "context", "steps", "expected"):
        if not x.get(k): e.append(f"exercise.{k} manquant")
    if not 3 <= len(x.get("steps") or []) <= 8: e.append("exercise.steps 3-8")
    if L(x.get("expected")) < 200: e.append("exercise.expected ≥ 200 car. (corrigé ou exemple de réponse attendue)")
    if not isinstance(x.get("duration_min"), int): e.append("exercise.duration_min (int)")
    if not re.search(r"D\d\d", json.dumps(x, ensure_ascii=False)): e.append("exercise : cite au moins un document du dossier fil rouge (D01…D20)")
    if d.get("ia"):
        p = x.get("ia_prompt") or {}
        if L(p.get("prompt")) < 300: e.append("exercise.ia_prompt.prompt ≥ 300 car. (capsule IA)")
        if len(p.get("guardrails") or []) < 2: e.append("exercise.ia_prompt.guardrails ≥ 2")
    dl = d.get("deliverable") or {}
    for k in ("title", "format", "criteria"):
        if not dl.get(k): e.append(f"deliverable.{k} manquant")
    if not 4 <= len(dl.get("criteria") or []) <= 7: e.append("deliverable.criteria 4-7")
    if not d.get("sources"): e.append("sources manquantes (au moins « Proposition pédagogique Éco-Propriété »)")
    if L(d.get("notes_prod")) < 40: e.append("notes_prod ≥ 40 car. (visuels, B-roll, points à valider)")

def module(d, e, path):
    for k in ("id", "title", "entry", "exit", "capsules", "case", "reminders"):
        if k not in d: e.append(f"module.{k} manquant")
    c = d.get("case") or {}
    for k in ("title", "brief", "documents", "tasks", "deliverable", "criteria", "duration_min"):
        if not c.get(k): e.append(f"case.{k} manquant")
    if L(c.get("brief")) < 400: e.append("case.brief ≥ 400 car.")
    if not 4 <= len(c.get("tasks") or []) <= 10: e.append("case.tasks 4-10")
    if not 4 <= len(c.get("criteria") or []) <= 10: e.append("case.criteria 4-10")
    for crit in c.get("criteria") or []:
        if not isinstance(crit, dict) or not crit.get("label") or not isinstance(crit.get("points"), int): e.append("case.criteria : {label, points:int, expected}"); break
    r = d.get("reminders") or {}
    for k in ("J1", "J7", "J30"):
        x = r.get(k) or {}
        if not x.get("subject") or not x.get("message") or L(x.get("sms")) > 160 or not x.get("sms"): e.append(f"reminders.{k} : subject, message, sms ≤ 160")
        qs = x.get("questions") or []
        if not 2 <= len(qs) <= 3: e.append(f"reminders.{k}.questions 2-3")
        for i, q in enumerate(qs): mcq(q, i, e, f"reminders.{k}")

def glob(d, e, path):
    p = (d.get("positioning") or {}).get("questions") or []
    f = (d.get("final") or {}).get("questions") or []
    if len(p) != 20: e.append(f"positioning : {len(p)} questions (20, 4 par module)")
    if len(f) != 40: e.append(f"final : {len(f)} questions (40, 8 par module)")
    for tag, qs, n in (("positioning", p, 4), ("final", f, 8)):
        for i, q in enumerate(qs): mcq(q, i, e, tag)
        for m in range(1, 6):
            k = sum(1 for q in qs if q.get("module") == m)
            if k != n: e.append(f"{tag} : module {m} a {k} questions (attendu {n})")
    docs = (d.get("dossier") or {}).get("documents") or []
    ids = [x.get("id") for x in docs]
    for i in range(1, 21):
        if f"D{i:02d}" not in ids: e.append(f"dossier : document D{i:02d} manquant")
    for x in docs:
        if len(json.dumps(x.get("sections", []), ensure_ascii=False)) < 300: e.append(f"dossier {x.get('id')} : contenu trop mince")
    s = d.get("satisfaction") or {}
    if not 8 <= len(s.get("questions") or []) <= 20: e.append("satisfaction.questions 8-20")
    if not (d.get("attestation") or {}).get("text"): e.append("attestation.text manquant")
    for k in ("start", "end"):
        if not d.get(k): e.append(f"{k} manquant")

if __name__ == "__main__":
    ok = True
    for f in sys.argv[1:]:
        d = json.load(open(f)); e = []
        b = os.path.basename(f)
        (module if b == "module.json" else glob if b == "global.json" else capsule)(d, e, f)
        print(("OK  " if not e else "ERR ") + f); [print("   -", x) for x in e]; ok &= not e
    sys.exit(0 if ok else 1)
