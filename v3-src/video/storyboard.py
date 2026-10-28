#!/usr/bin/env python3
"""Storyboards des vidéos de capsules (prérequis, modules 1 à 3).
Usage : python3 storyboard.py  →  video/boards/<id>.json (une scène = un plan animé + son sous-titre).
Sans voix : la durée de chaque scène vient du temps de lecture de son sous-titre."""
import json, os, re, glob, ast
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.dirname(HERE)
OUT = os.path.join(HERE, "boards")
os.makedirs(OUT, exist_ok=True)
C = json.loads(open(os.path.join(SRC, "build", "site", "data.js"), encoding="utf-8").read().split("=", 1)[1].rstrip().rstrip(";"))
MAXT = 270.0  # 4 min 30
COL = {0: "#8E1B3A", 1: "#E2231A", 2: "#F08A00", 3: "#D9AD00"}
MOZI = ["base", "clin-oeil", "telephone", "sur-de-lui", "pointe", "bof", "presente", "presse"]

def words(t): return len(re.findall(r"\w+", t or ""))
def dur(t, lo=3.5, extra=1.4):
    return max(lo, words(t) / 2.7 + extra)
def clip(t, n=38):
    w = (t or "").split()
    return t if len(w) <= n else " ".join(w[:n]).rstrip(",;:") + "…"
def lit(v):
    if isinstance(v, (list, dict)): return v
    if not isinstance(v, str): return v
    for f in (json.loads, ast.literal_eval):
        try: return f(v)
        except Exception: pass
    return v
def h(s): return sum(ord(c) for c in s)
def sentences(t):
    return [x.strip() for x in re.split(r"(?<!\bM\.)(?<!Mme\.)(?<!\bMM\.)(?<=[.!?…])\s+", t or "") if x.strip()]

def chapter_board(cap, ch, mid):
    sc = []
    for s in ch["screens"]:
        k = s.get("kind"); v = s.get("voice") or s.get("title") or ""
        d = {"kind": k, "title": s.get("title", ""), "caption": v}
        for key in ("items", "beats", "wrong", "why", "lines", "value", "label", "steps", "prompt", "context", "model_answer",
                    "card1", "card2", "goal", "tools", "tool", "cta", "ask", "status", "line", "scene", "guess"):
            if key in s: d[key] = lit(s[key])
        if k == "stat" and isinstance(d.get("guess"), dict): d.pop("guess")
        t = dur(v)
        if k == "quiz":
            c1 = d.get("card1") or {}
            d["caption"] = (v + " " + (c1.get("question", "") if isinstance(c1, dict) else "")).strip()
            fb = (c1.get("fb_text") or c1.get("feedback") or "") if isinstance(c1, dict) else ""
            d["fb"] = clip(fb, 40)
            t = max(dur(d["caption"]) + dur(d["fb"], 3), 12)
        if k == "retrieval":
            t = max(t, dur((d.get("context") or "") + " " + (d.get("model_answer") or ""), 8, 2))
        if k in ("steps", "demo") and isinstance(d.get("steps"), list):
            t = max(t, 2.2 * len(d["steps"]) + 2)
        if k == "belief": t = max(t, 8)
        if k == "mozi": d["pose"] = MOZI[h(cap["id"]) % len(MOZI)]
        d["dur"] = round(t, 2)
        sc.append(d)
    return sc

def table_items(sec):
    rows = sec.get("rows") or []
    hd = sec.get("headers") or []
    return {"headers": hd[:4], "rows": [[clip(str(c), 12) for c in r[:4]] for r in rows[:5]]}

def capsule_board(cap, mid):
    sc = []
    t = "Capsule %s. %s" % (cap["id"], cap["title"])
    sc.append({"kind": "welcome", "title": cap["title"], "caption": t, "dur": max(5, dur(t))})
    sc.append({"kind": "objective", "title": "Objectif", "text": cap.get("objective", ""), "caption": "À la fin de cette capsule : " + cap.get("objective", ""), "dur": dur(cap.get("objective", ""), 5)})
    qs = (cap.get("quiz") or {}).get("questions") or []
    if qs:
        q = qs[0]; wrong = [i for i in range(len(q["options"])) if i != q["answer"]]
        wi = wrong[0]
        line = q["options"][wi].strip("« »\" ")
        qq = clip(q["question"], 40)
        sc.append({"kind": "mozi", "title": "Mozi, lui, ferait ça", "line": clip(line, 30), "pose": MOZI[h(cap["id"]) % len(MOZI)], "scene": qq,
                   "caption": "%s Mozi, lui, répondrait : « %s »" % (qq, clip(line, 30)), "dur": max(7, dur(qq + " " + line))})
        why = q["whys"][wi]
        sc.append({"kind": "consequence", "title": "Pourquoi c'est une erreur", "lines": [clip(why, 30)], "caption": why, "dur": dur(why, 5)})
    pitch = (cap.get("video") or {}).get("pitch", "")
    if pitch:
        ss = sentences(pitch)
        sc.append({"kind": "pitch", "title": "Ce que tu vas voir", "lines": [clip(x, 34) for x in ss[:4]], "caption": pitch, "dur": dur(pitch, 6)})
    res = cap.get("resource") or {}
    secs = [s for s in (res.get("sections") or []) if s.get("items") or s.get("rows") or s.get("text")]
    for s in secs[:4]:
        ty = s.get("type", "list")
        d = {"kind": "section", "stype": ty, "title": s.get("heading", "")}
        if ty == "table":
            d["table"] = table_items(s)
            cap_t = s.get("heading", "") + ". " + " ; ".join(" : ".join(str(c) for c in r[:2]) for r in (s.get("rows") or [])[:3])
        elif ty in ("text", "formula") and s.get("text"):
            d["text"] = clip(s["text"], 55)
            cap_t = s.get("heading", "") + ". " + d["text"]
        else:
            its = [clip(str(x), 22) for x in (s.get("items") or [])[:5]]
            d["items"] = its
            cap_t = s.get("heading", "") + ". " + " ".join(its)
        d["caption"] = clip(cap_t, 70)
        d["dur"] = min(34, max(dur(d["caption"]), 2.4 * len(d.get("items", [])) + 3))
        sc.append(d)
    if len(qs) > 1:
        q = qs[1]
        sc.append({"kind": "quiz", "title": "Teste-toi", "card1": {"question": q["question"], "options": q["options"], "answer": q["answer"]},
                   "fb": clip(q.get("fb_text", ""), 40), "caption": q["question"], "dur": max(12, dur(q["question"]) + dur(clip(q.get("fb_text", ""), 40), 3))})
    ex = cap.get("exercise") or {}
    if ex:
        st = [clip(x, 18) for x in (ex.get("steps") or [])[:5]]
        c = "À toi de jouer : %s. %s minutes." % (ex.get("title", ""), ex.get("duration_min", ""))
        sc.append({"kind": "steps", "title": "À toi : " + ex.get("title", ""), "steps": [{"label": x, "detail": ""} for x in st], "caption": c, "dur": max(dur(c), 2.2 * len(st) + 2)})
    dl = cap.get("deliverable") or {}
    if dl:
        c = "Ton livrable : %s. Il sera validé sur ces critères." % dl.get("title", "")
        sc.append({"kind": "proof", "title": "Ton livrable : " + dl.get("title", ""), "items": [clip(x, 16) for x in (dl.get("criteria") or [])[:5]], "caption": c, "dur": max(dur(c), 2 * len((dl.get("criteria") or [])[:5]) + 3)})
    c = "Bravo. Télécharge la fiche, fais l'exercice et dépose ton livrable."
    sc.append({"kind": "bravo", "title": "Bravo !", "status": res.get("title", ""), "caption": c, "dur": 6})
    return sc

def fit(sc):
    tot = sum(s["dur"] for s in sc)
    if tot > MAXT:
        k = MAXT / tot
        for s in sc: s["dur"] = round(s["dur"] * k, 2)
    return sc

n = 0
for m in C["modules"]:
    if m["id"] > 3: continue
    code = "P" if m["id"] == 0 else "M%d" % m["id"]
    for cap in m["capsules"]:
        p = os.path.join(SRC, "content", "v4", code, "chap_%s.json" % cap["id"])
        ch = json.load(open(p)) if os.path.exists(p) else None
        sc = chapter_board(cap, ch, m["id"]) if ch else capsule_board(cap, m["id"])
        b = {"id": cap["id"], "module": m["id"], "modlabel": "Prérequis" if m["id"] == 0 else "Module %d" % m["id"], "modtitle": m["title"],
             "color": COL[m["id"]], "title": cap["title"], "chapter": bool(ch), "scenes": fit(sc)}
        b["total"] = round(sum(s["dur"] for s in b["scenes"]), 2)
        json.dump(b, open(os.path.join(OUT, "%s.json" % cap["id"]), "w"), ensure_ascii=False, indent=1)
        n += 1
tots = [json.load(open(f))["total"] for f in glob.glob(os.path.join(OUT, "*.json"))]
print("boards", n, "durée totale %.0f min, moy %.0f s, max %.0f s" % (sum(tots) / 60, sum(tots) / len(tots), max(tots)))
