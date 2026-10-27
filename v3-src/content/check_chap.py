"""Contrôle d'un ou plusieurs chapitres au gabarit 15 écrans.
Usage : python3 check_chap.py content/M1/chap_1.3.json [...]   (sans argument : tous les chapitres)
Sortie : ERREUR (bloquant) / ALERTE (à regarder). Code retour 1 s'il y a une erreur.
"""
import json, re, sys, glob, os

HERE = os.path.dirname(os.path.abspath(__file__))
KINDS = ["welcome", "goals", "mozi", "belief", "consequence", "stat", "steps", "retrieval", "quiz",
         "tools", "demo", "demo", "action", "proof", "bravo"]
BRICKS = [1, 1, 2, 2, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6]
SPEC = {"goals": ["items"], "mozi": ["line", "scene"], "belief": ["beats", "wrong", "why"], "consequence": ["lines"],
        "stat": ["value", "label"], "steps": ["steps"], "retrieval": ["prompt", "model_answer", "keywords"],
        "quiz": ["card1", "card2"], "tools": ["goal", "tools"], "demo": ["tool", "steps"],
        "action": ["cta", "url"], "proof": ["ask", "later", "later_text"], "bravo": ["status"]}
INTERACTIVE = {"retrieval", "quiz", "action", "proof"}


def sec(t):
    m, s = t.split(":")
    return int(m) * 60 + int(s)


def check(path):
    err, warn = [], []
    try:
        d = json.load(open(path))
    except Exception as e:
        return ["JSON illisible : %s" % e], []
    for k in ["id", "module", "title", "capsule_title", "duration", "objective", "mozi", "screens", "sources"]:
        if k not in d:
            err.append("champ manquant : " + k)
    sc = d.get("screens", [])
    if len(sc) != 15:
        err.append("%d écrans au lieu de 15" % len(sc))
    prev = 0
    for i, s in enumerate(sc[:15]):
        tag = "écran %s" % (i + 1)
        for k in ["n", "brick", "kind", "tc", "end", "title", "voice", "voice_status", "interaction", "source"]:
            if k not in s:
                err.append(tag + " : champ manquant " + k)
        if s.get("n") != i + 1:
            err.append(tag + " : n=%s" % s.get("n"))
        if s.get("kind") != KINDS[i]:
            err.append(tag + " : type %s au lieu de %s" % (s.get("kind"), KINDS[i]))
        if s.get("brick") != BRICKS[i]:
            err.append(tag + " : brique %s au lieu de %s" % (s.get("brick"), BRICKS[i]))
        for k in SPEC.get(s.get("kind"), []):
            if s.get(k) in (None, "", [], {}):
                err.append(tag + " : champ %s vide" % k)
        try:
            a, b = sec(s["tc"]), sec(s["end"])
            if a != prev:
                err.append(tag + " : commence à %s (attendu %d:%02d)" % (s["tc"], prev // 60, prev % 60))
            prev = b
            words = len(re.findall(r"\w+", s.get("voice", "")))
            need = (b - a) * 2.5
            if words > (b - a) * 2.9 + 4:
                warn.append(tag + " : %d mots pour %d s (trop long)" % (words, b - a))
            elif s.get("kind") in ("steps", "demo") and words < need * 0.35:
                warn.append(tag + " : %d mots pour %d s (court pour un écran de cours)" % (words, b - a))
        except Exception:
            err.append(tag + " : tc/end invalides")
        if s.get("kind") == "quiz":
            c1 = s.get("card1") or {}
            if len(c1.get("options", [])) != 3 or len(c1.get("whys", [])) != 3 or c1.get("answer") not in (0, 1, 2):
                err.append(tag + " : carte 1 = 3 options, 3 whys, answer 0-2")
        if s.get("kind") in ("steps",) and len(s.get("steps", [])) != 3:
            err.append(tag + " : le cours doit avoir 3 étapes")
        if s.get("kind") == "belief" and len(s.get("beats", [])) != 3:
            err.append(tag + " : la croyance tient en 3 temps")
        if s.get("kind") == "goals" and [x.get("verb") for x in s.get("items", [])] != ["Comprendre", "Appliquer", "Prouver"]:
            err.append(tag + " : verbes Comprendre / Appliquer / Prouver")
        if s.get("kind") == "action" and not str(s.get("url", "")).startswith(("http", "#")):
            err.append(tag + " : url invalide")
    if prev != 270:
        err.append("durée totale %d:%02d au lieu de 4:30" % (prev // 60, prev % 60))
    txt = json.dumps(d, ensure_ascii=False)
    if re.search(r"\bSeb\b", txt):
        err.append("« Seb » trouvé : écrire « Sébastien Paumier »")
    if re.search(r"(?<!-)\bvous\b", " ".join(s.get("voice", "") for s in sc if s.get("kind") != "mozi"), re.I):
        warn.append("« vous » dans une voix : tutoiement attendu (sauf citation)")
    if re.search(r"[\U0001F300-\U0001FAFF]", txt):
        err.append("émoji trouvé")
    return err, warn


def main():
    files = sys.argv[1:] or sorted(glob.glob(os.path.join(HERE, "M*", "chap_*.json")))
    bad = 0
    for f in files:
        e, w = check(f)
        print(("OK    " if not e else "ERREUR") + " " + os.path.basename(f) + ("" if not (e or w) else ""))
        for x in e:
            print("   ERREUR " + x)
        for x in w:
            print("   ALERTE " + x)
        bad += bool(e)
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
