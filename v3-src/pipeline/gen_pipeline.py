#!/usr/bin/env python3
"""Génère le pipeline de production par module (fiches F1/F2/F3 pré-remplies + tableaux de bord)
à partir des JSON réels de la formation. Usage : python3 gen_pipeline.py <content_dir> <kit_qui_intervient.md> <out_dir>"""
import json, os, re, sys, glob, csv

CON, KIT, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(OUT, exist_ok=True)
words = lambda t: len(re.findall(r"\w+", t or ""))
COLOR = {1: "rouge", 2: "orange", 3: "jaune", 4: "vert clair", 5: "vert"}
SLUG = {1: "Se-differencier", 2: "Estimer", 3: "Exclusivite", 4: "Compromis", 5: "Securiser"}
SITE = "https://eco-consultant-parcours.vercel.app"

# Experts par capsule, d'après 04_QUI-INTERVIENT-OU.md du kit
EXP = {}
role = None
for line in open(KIT, encoding="utf-8"):
    m = re.match(r"## `(\w+)`", line)
    if m: role = m.group(1); continue
    m = re.match(r"- \[ \] \*\*(\d\.\d+)\*\*", line)
    if m and role: EXP.setdefault(m.group(1), set()).add(role)

def capkey(p): a, b = re.findall(r"cap_(\d+)\.(\d+)", p)[0]; return int(a), int(b)
mods = []
for n in range(1, 6):
    mj = json.load(open(f"{CON}/M{n}/module.json", encoding="utf-8"))
    caps = [json.load(open(p, encoding="utf-8")) for p in sorted(glob.glob(f"{CON}/M{n}/cap_*.json"), key=capkey)]
    mods.append((mj, caps))

def stage(c):
    if (c.get("video") or {}).get("src"): return "6 · Validation (F4)"
    return "2 · Script à valider (F3)"

def zone(code, title, body, decision=True):
    d = "**Décision :** [ ] OK tel quel  [ ] À modifier  [ ] À réécrire\n**Correction (texte exact ou consigne) :**\n✏️\n" if decision else ""
    return f"<!-- ✏️ ZONE {code} — DÉBUT -->\n### ✏️ {title}\n{body.rstrip()}\n\n{d}<!-- ✏️ ZONE {code} — FIN -->\n\n"

def q(s): return (s or "").replace("\n", " ").replace("|", "/").strip()
def dec(x, n=1): return f"{x:.{n}f}".replace(".", ",")
SIGLES_KNOWN = {"DPE": "D-P-E (épelé)", "ADEME": "« adémé »", "PPPT": "P-P-P-T (épelé)", "ITE": "I-T-E (épelé)", "VMC": "V-M-C (épelé)",
                "HCSF": "H-C-S-F (épelé)", "PTZ": "P-T-Z (épelé)", "AG": "A-G (épelé)", "DISC": "« disc »", "CCH": "C-C-H (épelé)",
                "IA": "I-A (épelé)", "TVA": "T-V-A (épelé)", "DDT": "D-D-T (épelé)", "ECS": "E-C-S (épelé)", "CET": "C-E-T (épelé)",
                "TAEG": "T-A-E-G (épelé)", "DVF": "D-V-F (épelé)", "RGPD": "R-G-P-D (épelé)", "SMS": "S-M-S (épelé)"}

# ------------------------------------------------------------------ fichiers par module
rows = []
for mj, caps in mods:
    n = mj["id"]; d = os.path.join(OUT, f"M{n}_{SLUG[n]}"); os.makedirs(os.path.join(d, "capsules"), exist_ok=True)
    tw = 0
    # ---- F2 / F3 par capsule
    for c in caps:
        cid = c["id"]; fid = cid.replace(".", "-"); v = c["video"]; seg = v["segments"]
        nw = sum(words(s["voice"]) for s in seg); tw += nw
        ex = sorted(EXP.get(cid, set()))
        rows.append({"Module": f"M{n}", "Capsule": cid, "Titre": c["title"], "IA": "oui" if c.get("ia") else "non",
                     "Mots voix": nw, "Durée vidéo (min)": round(nw / 140 + 0.08, 1), "Étape": stage(c),
                     "Experts à solliciter": " · ".join(ex) or "FORM", "Responsable": "", "Date cible": "",
                     "Vidéo": "publiée (HLS)" if v.get("src") else "à produire", "Validation F4": "en attente",
                     "Blocages / notes": "Modèle de référence : valider en premier" if cid == "1.1" else ""})
        # F2
        quiz = "\n".join(f"{i+1}. {q(x['question'])}\n   → bonne réponse : « {q(x['options'][x['answer']])} »" for i, x in enumerate(c["quiz"]["questions"]))
        res = c["resource"]; exo = c["exercise"]; dl = c["deliverable"]
        secs = " · ".join(s["heading"] for s in res["sections"])
        steps = "\n".join(f"{i+1}. {q(s)}" for i, s in enumerate(exo.get("steps", [])))
        crit = "\n".join(f"- {q(x)}" for x in dl["criteria"])
        srcs = "\n".join(f"- {q(s.get('label'))}" + (f" — {s['url']}" if s.get("url") else "") for s in c.get("sources", []))
        ia = ""
        if c.get("ia") and exo.get("ia_prompt"):
            ia = f"\n**Prompt IA (extrait)** : {q(exo['ia_prompt']['prompt'])[:400]}…\n**Garde-fous** :\n" + "\n".join(f"- {q(g)}" for g in exo["ia_prompt"].get("guardrails", []))
        f2 = f"""# F2 · Capsule {cid} · {c['title']}

> Fiche **pré-remplie avec le contenu actuel** de la capsule (fichier `v3-src/content/M{n}/cap_{cid}.json`). Pour chaque zone : coche **OK tel quel** ou décris la correction.
> Modèle de référence : capsule 1.1. Voir la capsule en ligne : {SITE}

**Module {n}** · {mj['title']} · **Capsule IA :** {"oui" if c.get("ia") else "non"} · **Experts à solliciter :** {" · ".join(ex) or "FORM"}
**Rempli par (nom, rôle) :** ✏️      **Date :** ✏️

"""
        f2 += zone(f"{cid}-F2-titre", "1. Titre et objectif", f"**Titre actuel :** {c['title']}\n**Objectif actuel :** {q(c['objective'])}")
        f2 += zone(f"{cid}-F2-accroche", "2. Accroche (20 premières secondes)", f"**Actuelle :** {q(v.get('hook'))}")
        f2 += zone(f"{cid}-F2-reperes", "3. Repères clés affichés dans la vidéo", "\n".join(f"- {s['tc']} · {q(s.get('onscreen')) or '(pas de texte incrusté)'}" for s in seg))
        f2 += zone(f"{cid}-F2-quiz", f"4. Quiz flash ({len(c['quiz']['questions'])} questions)", quiz)
        f2 += zone(f"{cid}-F2-fiche", "5. Fiche à télécharger (PDF)", f"**Titre :** {res['title']}\n**Sections :** {secs}")
        f2 += zone(f"{cid}-F2-exercice", "6. Exercice (Je pratique)", f"**Titre :** {exo['title']} · **Durée :** {exo.get('duration_min', '?')} min\n**Documents :** {', '.join(exo.get('materials', []))}\n**Étapes :**\n{steps}{ia}")
        f2 += zone(f"{cid}-F2-livrable", "7. Livrable (Je dépose)", f"**Titre :** {dl['title']}\n**Format :** {q(dl.get('format'))}\n**Critères :**\n{crit}")
        f2 += zone(f"{cid}-F2-sources", "8. Sources citées", srcs or "(aucune)")
        f2 += zone(f"{cid}-F2-points", "9. Points à valider (notes de production)", q(c.get("notes_prod")) or "(aucun)", decision=False) .replace("<!-- ✏️ ZONE " + f"{cid}-F2-points — FIN -->", "**Réponse de l'expert :**\n✏️\n<!-- ✏️ ZONE " + f"{cid}-F2-points — FIN -->")
        f2 += zone(f"{cid}-F2-decision", "10. Décision", "[ ] Contenu validé : passer au script vidéo (F3)\n[ ] Contenu validé sous réserve des corrections ci-dessus\n[ ] À revoir avant toute vidéo : ✏️", decision=False)
        open(os.path.join(d, "capsules", f"{fid}_F2_cadrage.md"), "w", encoding="utf-8").write(f2)
        # F3
        alltext = " ".join(s["voice"] for s in seg)
        sig = sorted({t for t in re.findall(r"\b[A-Z]{2,5}\b", alltext)})
        pron = "\n".join(f"- {t} → {SIGLES_KNOWN.get(t, '✏️ à préciser')}" for t in sig) or "- (aucun sigle repéré)"
        table = "\n".join(f"| {s['tc']} | {q(s['voice'])} | {q(s.get('screen'))} | {q(s.get('onscreen'))} |" for s in seg)
        moments = "\n".join(f"| {s['tc']} | ✏️ (mots exacts de Seb) | {q(s.get('onscreen'))} |" for s in seg if s.get("onscreen"))
        status = "**Vidéo déjà produite et publiée (v2, SEB -- 5 + motion design).** Toute correction du texte oblige à refaire la voix, l'avatar et le rendu des segments concernés." if v.get("src") else "Vidéo **à produire**. Une fois ce script validé, Claude lance la chaîne de référence 1.1 (prompt P2)."
        f3 = f"""# F3 · Vidéo de la capsule {cid} · {c['title']}

> Script **actuel**, segment par segment (texte exact dit par Seb). {status}
> {len(seg)} segments · {nw} mots · ≈ {dec(nw / 140)} min. Chaîne vidéo : `04_VIDEO/01_chaine_video_reference_1-1.md`.

**Rempli par (nom, rôle) :** ✏️      **Date :** ✏️

"""
        f3 += zone(f"{cid}-F3-script", "1. Script à valider",
                   "| TC | Voix de Seb (texte exact) | Ce qu'on voit (consigne de montage) | Texte incrusté |\n|---|---|---|---|\n" + table +
                   "\n\n**Corrections** : cite le minutage (ex. « 03:25 ») puis le texte exact.")
        f3 += zone(f"{cid}-F3-prononciation", "2. Prononciation (sigles repérés dans le script)", pron + "\n**Autres mots ou noms à faire prononcer d'une certaine façon :** ✏️", decision=False)
        f3 += zone(f"{cid}-F3-moments", "3. Moments forts à animer (proposition : textes incrustés du script)",
                   "Complète la phrase exacte de Seb pour caler l'animation au mot près, ou ajoute tes propres moments.\n\n| TC | Phrase de Seb (mots exacts) | Ce qui apparaît à l'écran |\n|---|---|---|\n" + (moments or "| ✏️ | ✏️ | ✏️ |") + "\n| ✏️ | ✏️ | ✏️ |", decision=False)
        f3 += zone(f"{cid}-F3-reglages", "4. Réglages (par défaut : comme la 1.1)",
                   "**Look** : [x] SEB -- 5  [ ] autre : ✏️\n**Attitude** : [x] standard (chaleureux, gestes calmes)  [ ] plus dynamique  [ ] plus posé\n**Mise en page de Seb** : [x] Claude choisit comme dans la 1.1  [ ] je précise : ✏️\n**Intro / outro / sous-titres** : [x] comme la 1.1  [ ] autre : ✏️\n**Musique de fond** : [x] non  [ ] oui (connecteur ElevenLabs complet ou musique libre de droits fournie)\n**Visuels ou B-roll à fournir** : ✏️", decision=False)
        f3 += zone(f"{cid}-F3-decision", "5. Décision", "[ ] Go : Claude produit la vidéo (P2)\n[ ] Go, mais envoie-moi d'abord les images de contrôle avant le rendu final\n[ ] À revoir : ✏️", decision=False)
        open(os.path.join(d, "capsules", f"{fid}_F3_video.md"), "w", encoding="utf-8").write(f3)

    # ---- F1 pré-remplie
    case = mj["case"]
    capl = "\n".join(f"| {c['id']} | {c['title']} | {c['exercise']['title']} | {c['resource']['title']} | {'oui' if c.get('ia') else 'non'} |" for c in caps)
    crit = "\n".join(f"- {q(x['label'])} ({x['points']} pts) : {q(x['expected'])}" for x in case.get("criteria", []))
    rem = "\n".join(f"- **{k}** · {q(r.get('subject'))} · SMS : « {q(r.get('sms'))} » · {len(r.get('questions', []))} QCM" for k, r in mj["reminders"].items())
    f1 = f"""# F1 · Module {n} · {mj['title']}

> Fiche **pré-remplie avec le contenu actuel** du module (`v3-src/content/M{n}/module.json`). Coche **OK tel quel** ou décris la correction.

**Couleur DPE :** {COLOR[n]} · **Capsules :** {len(caps)} · **Mots de voix :** {tw} (≈ {round(tw / 140)} min de vidéo)
**Rempli par (nom, rôle) :** ✏️      **Date :** ✏️

"""
    f1 += zone(f"M{n}-F1-identite", "1. Identité du module", f"**Titre :** {mj['title']}\n**Point de départ :** {q(mj['entry'])}\n**Ce que l'apprenant produit (sortie) :** {q(mj['exit'])}")
    f1 += zone(f"M{n}-F1-capsules", "2. Liste des capsules", "| N° | Titre | Exercice | Fiche | IA |\n|---|---|---|---|---|\n" + capl + "\n\n**Capsule à ajouter, retirer ou déplacer :** ✏️")
    f1 += zone(f"M{n}-F1-cas", "3. Cas pratique de fin de module", f"**Titre :** {case['title']} · **Durée :** {case.get('duration_min', '?')} min\n**Énoncé :** {q(case.get('brief'))}\n**Livrable :** {q(case.get('deliverable'))}\n**Critères notés :**\n{crit}")
    f1 += zone(f"M{n}-F1-rappels", "4. Rappels J+1 · J+7 · J+30", rem)
    f1 += zone(f"M{n}-F1-experts", "5. Experts à solliciter sur ce module",
               "\n".join(f"- {c['id']} : {' · '.join(sorted(EXP.get(c['id'], set()))) or 'FORM'}" for c in caps) + "\n**Noms des experts :** ✏️", decision=False)
    f1 += zone(f"M{n}-F1-decision", "6. Décision", "[ ] Module validé tel quel : on passe aux capsules (F2)\n[ ] Validé sous réserve des corrections ci-dessus\n[ ] À revoir : ✏️", decision=False)
    open(os.path.join(d, f"M{n}_F1_cadrage_module.md"), "w", encoding="utf-8").write(f1)

    # ---- F5 module
    f5 = f"""# F5 · Publication du module {n} · {mj['title']}

> Paquet concerné : `ECO-CONSULTANT_M{n}_{SLUG[n]}_SCORM12_v3.0.zip` (section « Pour ton LMS » du site). Voir aussi la fiche modèle `06_A-REMPLIR_DECIDEUR/F5_publication_LMS.md` et la recette `02_LMS_SCORM/02_import_LMS_et_recette.md`.

**Rempli par (nom, rôle) :** ✏️      **Date de publication souhaitée :** ✏️

"""
    f5 += zone(f"M{n}-F5-perimetre", "1. Capsules prêtes (F4 validée)", "\n".join(f"[ ] {c['id']} · {c['title']}" for c in caps) + "\n\n**Publier même si toutes les vidéos ne sont pas prêtes ?** [ ] oui (message « vidéo en cours de production »)  [ ] non", decision=False)
    f5 += zone(f"M{n}-F5-recette", "2. Recette dans le LMS", "| Ligne | OK | Problème |\n|---|---|---|\n| 1 · ouverture | [ ] | ✏️ |\n| 2-3 · vidéos ordinateur et mobile | [ ] | ✏️ |\n| 7 · reprise | [ ] | ✏️ |\n| 8 · statut « terminé » | [ ] | ✏️ |\n| 9 · score | [ ] | ✏️ |", decision=False)
    f5 += zone(f"M{n}-F5-decision", "3. Décision", "[ ] Go : Claude publie le module (site + paquet SCORM)\n[ ] Bloqué : ✏️", decision=False)
    open(os.path.join(d, f"M{n}_F5_publication.md"), "w", encoding="utf-8").write(f5)

    # ---- tableau de bord du module
    mrows = [r for r in rows if r["Module"] == f"M{n}"]
    tb = f"""# Module {n} · {mj['title']} · tableau de bord

**Couleur :** {COLOR[n]} · **{len(caps)} capsules** · {tw} mots de voix (≈ {round(tw / 140)} min de vidéo) · cas pratique : {case['title']}
**Suivi en temps réel :** Google Sheet « Pipeline Éco-Consultant · suivi des 34 capsules » (onglet Capsules, filtre Module = M{n}).

## Les étapes d'une capsule
`1 Cadrage (F2)` → `2 Script à valider (F3)` → `3 Voix` → `4 Avatar` → `5 Motion design et rendu` → `6 Validation (F4)` → `7 Publiée (F5)`

## État de départ (23/10/2026)

| Capsule | Titre | IA | Mots | Étape | Experts | Fiches |
|---|---|---|---|---|---|---|
""" + "\n".join(f"| {r['Capsule']} | {r['Titre']} | {r['IA']} | {r['Mots voix']} | {r['Étape']} | {r['Experts à solliciter']} | `capsules/{r['Capsule'].replace('.', '-')}_F2_cadrage.md` · `…_F3_video.md` |" for r in mrows) + f"""

## Ordre de travail pour ce module
1. Valider le module : `M{n}_F1_cadrage_module.md`.
2. Pour chaque capsule, dans l'ordre : F2 (contenu), puis F3 (script vidéo). Les experts indiqués relisent les zones « Points à valider ».
3. Lancer la production vidéo avec le prompt P2 (une capsule à la fois, ou par lot de 2-3).
4. Valider chaque capsule en ligne avec une fiche F4 (copier `06_A-REMPLIR_DECIDEUR/F4_validation_capsule.md` en `capsules/x-y_F4_validation_<initiales>.md`).
5. Publier le module : `M{n}_F5_publication.md`.

## Journal du module
| Date | Capsule | Ce qui a avancé | Par |
|---|---|---|---|
| 23/10/2026 | toutes | Fiches F1, F2, F3 pré-remplies à partir du contenu actuel | Claude |
"""
    open(os.path.join(d, f"M{n}_00_TABLEAU_DE_BORD.md"), "w", encoding="utf-8").write(tb)

# ------------------------------------------------------------------ CSV pour le Google Sheet
with open(os.path.join(OUT, "suivi_capsules.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
json.dump(rows, open(os.path.join(OUT, "suivi_capsules.json"), "w", encoding="utf-8"), ensure_ascii=False)
print(len(rows), "capsules ;", sum(r["Mots voix"] for r in rows), "mots")
