#!/usr/bin/env python3
"""Build — Éco-Consultant v3 (5 modules, 34 capsules).
Produit dans build/ :
  site/                       site complet (aperçu, tout ouvert) pour Vercel / GitHub
  scorm/*.zip                 paquet complet + 1 paquet par module (SCORM 1.2)
  pdf/                        ressources (RES_x-y.pdf), cas pratiques (CAS_Mn.pdf), dossier fil rouge, scripts vidéo, guide formateur
  heygen/                     scripts prêts à coller (txt) + scripts.csv
  preview.html                fichier unique autonome (artifact)
Usage : python3 build.py [--no-pdf]"""
import json, os, sys, shutil, zipfile, glob, base64, re, csv, html, asyncio
ROOT = os.path.dirname(os.path.abspath(__file__))
CON, ENG, OUT = (os.path.join(ROOT, d) for d in ("content", "engine", "build"))
VERSION = "3.0"
META = {
    "key": "v3", "program": "Formation Éco-Consultant", "title": "Parcours e-learning : 5 modules, 34 capsules de 8 min",
    "subtitle": "Code couleur DPE : tu progresses du rouge (module 1) au vert (module 5), comme un logement rénové.",
    "duration": "≈ 37 à 46 heures de formation à distance (dont 4 h 32 de vidéo, 34 exercices et 5 cas pratiques)",
    "bands": {
        "ia": "Dans chaque module, des prompts métier prêts à l'emploi : contenus marketing, analyse DPE, plan de travaux, estimation, argumentaires, négociation.",
        "neuro": "Capsules de 8 min (attention), quiz flash après chaque vidéo (récupération active), rappels J+1, J+7, J+30 (répétition espacée), cas réels et fil rouge (émotion, récit).",
        "fr": "Un bien fictif réaliste : l'appartement de M. Bernard à Melun, son DPE, sa copropriété. Tu le fais avancer à chaque module."},
    "courseTitle": "Éco-Consultant : de la valeur verte à la vente sécurisée",
    "pitch": "Deviens l'agent de référence sur la performance énergétique : attire les propriétaires, estime avec le DPE, signe en exclusivité, sécurise le compromis et la vente. 34 vidéos de 8 minutes, des exercices sur un vrai dossier (fictif) et l'IA comme assistant à chaque étape.",
    "hours": "≈ 40 heures",
    "objectives": {
        "1": "Te positionner comme expert local de la performance énergétique et construire ta visibilité (offre, pitch, contenus).",
        "2": "Estimer un bien en intégrant le DPE, la décote ou la valeur verte et le coût réel des travaux.",
        "3": "Transformer un rendez-vous d'estimation en mandat exclusif grâce à un argumentaire énergétique solide.",
        "4": "Négocier et rédiger un compromis qui intègre les travaux, le financement et les obligations du vendeur.",
        "5": "Sécuriser la vente jusqu'à l'acte : conditions suspensives, copropriété, diagnostics et suivi client."},
    "skills": ["DPE et audit énergétique", "Estimation immobilière", "Valeur verte", "Prise de mandat exclusif", "Négociation", "Compromis de vente", "Copropriété", "Financement des travaux", "Prompts IA métier", "Marketing local"]}
COLORS = {1: ("#E2231A", "Rouge"), 2: ("#F08A00", "Orange"), 3: ("#E8B900", "Jaune"), 4: ("#8CC63F", "Vert clair"), 5: ("#2FA84F", "Vert")}
SLUG = {1: "Se-differencier", 2: "Estimer", 3: "Exclusivite", 4: "Compromis", 5: "Securiser"}

def capkey(f):
    m = re.search(r"cap_(\d+)\.(\d+)\.json$", f); return (int(m.group(1)), int(m.group(2)))

def load():
    mods = []
    for n in range(1, 6):
        mf = os.path.join(CON, f"M{n}", "module.json")
        if not os.path.exists(mf): sys.exit(f"manquant : {mf}")
        m = json.load(open(mf))
        caps = sorted(glob.glob(os.path.join(CON, f"M{n}", "cap_*.json")), key=capkey)
        m["capsules"] = [json.load(open(f)) for f in caps]
        m["id"] = n
        mods.append(m)
    g = json.load(open(os.path.join(CON, "global.json")))
    return mods, g

def course(mods, g, scope, preview, pdf=True):
    return {"meta": dict(META, key="v3-" + "-".join(map(str, scope["modules"]))), "modules": mods, "global": g, "scope": scope, "preview": preview, "pdf": pdf, "showProd": preview}

def write_pkg(dirp, data, scorm, title, ident):
    shutil.rmtree(dirp, ignore_errors=True); os.makedirs(dirp)
    for f in ("index.html", "app.js", "scorm.js"): shutil.copy(os.path.join(ENG, f), dirp)
    for d in ("assets", "fonts"): shutil.copytree(os.path.join(ENG, d), os.path.join(dirp, d))
    open(os.path.join(dirp, "data.js"), "w").write("window.COURSE=" + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";")
    pdfdir = os.path.join(OUT, "pdf")
    if data.get("pdf") and os.path.isdir(pdfdir):
        os.makedirs(os.path.join(dirp, "pdf"))
        keep = set()
        for m in data["modules"]:
            if m["id"] in data["scope"]["modules"]:
                keep |= {f"RES_{c['id'].replace('.', '-')}.pdf" for c in m["capsules"]} | {f"CAS_M{m['id']}.pdf"}
        keep.add("DOSSIER_fil-rouge.pdf")
        for f in keep:
            if os.path.exists(os.path.join(pdfdir, f)): shutil.copy(os.path.join(pdfdir, f), os.path.join(dirp, "pdf", f))
    if scorm:
        files = sorted(os.path.relpath(p, dirp).replace(os.sep, "/") for p in glob.glob(dirp + "/**/*", recursive=True) if os.path.isfile(p))
        res = "\n".join(f'      <file href="{html.escape(f)}"/>' for f in files)
        open(os.path.join(dirp, "imsmanifest.xml"), "w").write(f'''<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="{ident}" version="{VERSION}" xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2" xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata><schema>ADL SCORM</schema><schemaversion>1.2</schemaversion></metadata>
  <organizations default="ORG"><organization identifier="ORG"><title>{html.escape(title)}</title>
    <item identifier="ITEM" identifierref="RES" isvisible="true"><title>{html.escape(title)} (v{VERSION})</title><adlcp:masteryscore>70</adlcp:masteryscore></item>
  </organization></organizations>
  <resources><resource identifier="RES" type="webcontent" adlcp:scormtype="sco" href="index.html">
{res}
  </resource></resources>
</manifest>
''')

def zipdir(d, z):
    with zipfile.ZipFile(z, "w", zipfile.ZIP_DEFLATED) as zf:
        for p in sorted(glob.glob(d + "/**/*", recursive=True)):
            if os.path.isfile(p): zf.write(p, os.path.relpath(p, d))

# ---------- Rendu HTML imprimable (PDF) ----------
CSS = """@page{size:A4;margin:16mm 14mm 18mm}
*{box-sizing:border-box}body{font-family:Lato,'Segoe UI',Arial,sans-serif;color:#16201A;font-size:10.5pt;line-height:1.45;margin:0}
@font-face{font-family:Lato;src:url(LATO400);font-weight:400}@font-face{font-family:Lato;src:url(LATO700);font-weight:700 900}
.hd{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid MC;padding-bottom:6px;margin-bottom:12px}
.hd img{height:20px}.hd .k{font-size:8.5pt;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#5A6660}
h1{font-size:20pt;font-weight:900;margin:4px 0 6px;border-left:7px solid MC;padding-left:10px}
h2{font-size:14pt;margin:16px 0 6px;color:#13693B;break-after:avoid}
h3{font-size:11.5pt;margin:12px 0 4px;color:#13693B;break-after:avoid}
p{margin:0 0 6px}ul,ol{margin:0 0 6px;padding-left:18px}li{margin:2px 0}
ul.ck{list-style:none;padding-left:0}ul.ck li:before{content:'☐ ';color:#1A7A44;font-weight:900}
table{border-collapse:collapse;width:100%;margin:4px 0 8px;font-size:9.5pt;break-inside:auto}th{background:#E3F2E9;text-align:left;padding:4px 6px}td{border-top:1px solid #DDE5E0;padding:4px 6px;vertical-align:top}
tr{break-inside:avoid}.fx{background:#EEF2EF;border-radius:6px;padding:6px 8px;font-family:Consolas,monospace;white-space:pre-wrap}
.intro{background:#FFF1E0;border-radius:8px;padding:8px 10px;margin-bottom:8px}.foot{font-size:8.5pt;color:#5A6660;border-top:1px solid #DDE5E0;margin-top:12px;padding-top:6px}
.fict{display:inline-block;background:#FFF3D6;color:#6B4A00;border-radius:4px;padding:1px 6px;font-size:8.5pt;font-weight:700}
.seg{display:grid;grid-template-columns:44px 1fr;gap:8px;border-top:1px solid #DDE5E0;padding:5px 0;break-inside:avoid}.tc{font-weight:900;color:#13693B}.sc{color:#5A6660;font-style:italic;font-size:9pt}
.pb{break-before:page}.prompt{background:#14231B;color:#E8F3EC;border-radius:6px;padding:8px;font-family:Consolas,monospace;font-size:9pt;white-space:pre-wrap}"""

def e(s): return html.escape(str(s if s is not None else "")).replace("\n", "<br>")
def sections(secs):
    h = ""
    for s in secs or []:
        t = s.get("type") or ("table" if s.get("rows") else "list" if s.get("items") else "text")
        h += f"<h3>{e(s.get('heading'))}</h3>"
        if t == "table":
            h += "<table><thead><tr>" + "".join(f"<th>{e(x)}</th>" for x in s.get("headers", [])) + "</tr></thead><tbody>" + "".join("<tr>" + "".join(f"<td>{e(x)}</td>" for x in r) + "</tr>" for r in s.get("rows", [])) + "</tbody></table>"
        elif t in ("list", "checklist", "steps"):
            tag = "ol" if t == "steps" else "ul"; cls = ' class="ck"' if t == "checklist" else ""
            h += f"<{tag}{cls}>" + "".join(f"<li>{e(x)}</li>" for x in s.get("items", [])) + f"</{tag}>"
        elif t == "formula": h += f'<div class="fx">{e(s.get("text"))}</div>'
        else: h += f"<p>{e(s.get('text'))}</p>"
        if s.get("text") and t in ("list", "checklist", "steps", "table"): h += f"<p>{e(s.get('text'))}</p>"
    return h

def page(body, mc, kicker, logo):
    return f"<!doctype html><html lang='fr'><head><meta charset='utf-8'><style>{CSS.replace('MC', mc)}</style></head><body><div class='hd'><img src='{logo}'><span class='k'>{e(kicker)}</span></div>{body}</body></html>"

def pdf_jobs(mods, g):
    jobs = []
    for m in mods:
        mc = COLORS[m["id"]][0]
        for c in m["capsules"]:
            r = c["resource"]
            body = f"<h1>{e(r['title'])}</h1>" + (f"<div class='intro'>{e(r.get('intro'))}</div>" if r.get("intro") else "") + sections(r.get("sections")) + (f"<div class='foot'>{e(r.get('footer'))}</div>" if r.get("footer") else "") + "<div class='foot'>Éco-Consultant · Module " + str(m["id"]) + " · Capsule " + c["id"] + " — " + e(c["title"]) + " · Document pédagogique : vérifie toujours la réglementation en vigueur.</div>"
            jobs.append((f"RES_{c['id'].replace('.', '-')}.pdf", page(body, mc, f"Ressource · Module {m['id']} · Capsule {c['id']}", "LOGO")))
        k = m["case"]
        crit = "<table><thead><tr><th>Critère</th><th>Points</th><th>Attendu</th></tr></thead><tbody>" + "".join(f"<tr><td>{e(x.get('label'))}</td><td>{e(x.get('points'))}</td><td>{e(x.get('expected'))}</td></tr>" for x in k.get("criteria", [])) + "</tbody></table>"
        body = f"<h1>{e(k['title'])}</h1><p><b>Durée :</b> {k.get('duration_min')} min · <b>Sortie du module :</b> {e(m['exit'])}</p><div class='intro'>{e(k['brief'])}</div><h2>Documents</h2><ul>" + "".join(f"<li>{e(d)}</li>" for d in k.get("documents", [])) + "</ul><h2>Ce que tu dois faire</h2><ol>" + "".join(f"<li>{e(t)}</li>" for t in k.get("tasks", [])) + f"</ol><h2>Livrable</h2><p>{e(k.get('deliverable'))}</p>"
        if k.get("variants"): body += "<h2>Variantes</h2><ul>" + "".join(f"<li>{e(v if isinstance(v, str) else (v.get('title', '') + ' — ' + (v.get('text') or v.get('description') or '')))}</li>" for v in k["variants"]) + "</ul>"
        body += "<h2>Grille d'évaluation</h2>" + crit
        jobs.append((f"CAS_M{m['id']}.pdf", page(body, mc, f"Cas pratique · Module {m['id']}", "LOGO")))
    docs = g["dossier"]["documents"]
    body = "<h1>Dossier fil rouge — l'appartement de M. Bernard</h1><p><span class='fict'>Documents fictifs à usage pédagogique</span></p><p>" + e(g.get("start", {}).get("dossier_intro", "")) + "</p><h2>Sommaire</h2><ol>" + "".join(f"<li>{d['id']} · {e(d['title'])}</li>" for d in docs) + "</ol>"
    for d in docs: body += f"<div class='pb'></div><h1>{d['id']} · {e(d['title'])}</h1><p><span class='fict'>Document fictif à usage pédagogique</span></p>" + sections(d.get("sections"))
    jobs.append(("DOSSIER_fil-rouge.pdf", page(body, "#1A7A44", "Dossier fil rouge", "LOGO")))
    # Scripts vidéo (pour Seb et le montage)
    body = "<h1>Scripts vidéo — 34 capsules de 8 min</h1><p>Pour chaque capsule : texte exact dit par Seb, minutage, plan à l'écran et incrustations. À valider avant génération HeyGen.</p>"
    for m in mods:
        for c in m["capsules"]:
            v = c["video"]; w = sum(len(re.findall(r"\w+", s["voice"])) for s in v["segments"])
            body += f"<div class='pb'></div><h1>{c['id']} · {e(c['title'])}</h1><p><b>Module {m['id']}</b> · {w} mots ≈ {round(w / 140, 1)} min · Accroche : « {e(v.get('hook'))} »</p>"
            body += "".join(f"<div class='seg'><span class='tc'>{e(s['tc'])}</span><span>{e(s['voice'])}<br><span class='sc'>Plan : {e(s.get('screen'))}{(' · À l’écran : ' + e(s.get('onscreen'))) if s.get('onscreen') else ''}</span></span></div>" for s in v["segments"])
            if c.get("notes_prod"): body += f"<p class='sc'><b>Notes de production :</b> {e(c['notes_prod'])}</p>"
    jobs.append(("SCRIPTS_videos.pdf", page(body, "#1A7A44", "Scripts vidéo · Seb", "LOGO")))
    # Guide formateur (corrigés + grilles) — NE PAS diffuser aux apprenants
    body = "<h1>Guide formateur — corrigés et grilles de validation</h1><p><b>Document réservé au formateur.</b> Pour chaque capsule : objectif, corrigé de l'exercice, critères de validation du livrable, réponses du quiz flash.</p>"
    for m in mods:
        body += f"<div class='pb'></div><h1>Module {m['id']} · {e(m['title'])}</h1>"
        for c in m["capsules"]:
            x = c["exercise"]; d = c["deliverable"]
            body += f"<h2>{c['id']} · {e(c['title'])}</h2><p><b>Objectif :</b> {e(c['objective'])}</p><h3>Exercice : {e(x['title'])}</h3><p>{e(x['context'])}</p><h3>Corrigé</h3><p>{e(x['expected'])}</p>"
            if x.get("ia_prompt"): body += f"<h3>Prompt IA</h3><div class='prompt'>{e(x['ia_prompt']['prompt'])}</div>"
            body += f"<h3>Livrable : {e(d['title'])}</h3><ul class='ck'>" + "".join(f"<li>{e(k)}</li>" for k in d["criteria"]) + "</ul><h3>Quiz flash (réponses)</h3><ol>" + "".join(f"<li>{e(q['question'])} → <b>{e(q['options'][q['answer']])}</b></li>" for q in c["quiz"]["questions"]) + "</ol>"
    jobs.append(("GUIDE_formateur.pdf", page(body, "#1A7A44", "Guide formateur · confidentiel", "LOGO")))
    return jobs

async def render_pdfs(jobs, outdir):
    from playwright.async_api import async_playwright
    b64 = lambda p, mt: f"data:{mt};base64," + base64.b64encode(open(p, "rb").read()).decode()
    logo = b64(os.path.join(ENG, "assets", "logo-dark.png"), "image/png")
    l4 = b64(os.path.join(ENG, "fonts", "lato-400.woff2"), "font/woff2"); l7 = b64(os.path.join(ENG, "fonts", "lato-700.woff2"), "font/woff2")
    async with async_playwright() as p:
        br = await p.chromium.launch(); pg = await br.new_page()
        for name, htm in jobs:
            htm = htm.replace("LOGO", logo, 1).replace("url(LATO400)", f"url({l4})").replace("url(LATO700)", f"url({l7})")
            await pg.set_content(htm, wait_until="load")
            await pg.pdf(path=os.path.join(outdir, name), format="A4", print_background=True, display_header_footer=True,
                         header_template="<span></span>", footer_template="<div style='font-size:7pt;color:#777;width:100%;text-align:center'>Éco-Consultant · Éco-Propriété — page <span class='pageNumber'></span>/<span class='totalPages'></span></div>",
                         margin={"top": "14mm", "bottom": "16mm", "left": "13mm", "right": "13mm"})
        await br.close()

def heygen(mods):
    d = os.path.join(OUT, "heygen"); shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
    with open(os.path.join(d, "scripts.csv"), "w", newline="") as f:
        w = csv.writer(f, delimiter=";"); w.writerow(["capsule", "module", "titre", "mots", "duree_estimee_min", "script"])
        for m in mods:
            for c in m["capsules"]:
                txt = "\n\n".join(s["voice"] for s in c["video"]["segments"]); n = len(re.findall(r"\w+", txt))
                w.writerow([c["id"], m["id"], c["title"], n, round(n / 140, 1), txt])
                open(os.path.join(d, f"script_{c['id'].replace('.', '-')}.txt"), "w").write(f"{c['id']} — {c['title']}\n\n{txt}\n")

def preview_file(data):
    h = open(os.path.join(ENG, "index.html")).read()
    b64 = lambda p, mt: f"data:{mt};base64," + base64.b64encode(open(p, "rb").read()).decode()
    for f in os.listdir(os.path.join(ENG, "fonts")): h = h.replace(f"url(fonts/{f})", "url(" + b64(os.path.join(ENG, "fonts", f), "font/woff2") + ")")
    app = open(os.path.join(ENG, "app.js")).read()
    for f in os.listdir(os.path.join(ENG, "assets")):
        u = b64(os.path.join(ENG, "assets", f), "image/png"); h = h.replace(f"assets/{f}", u); app = app.replace(f"assets/{f}", u)
    d = dict(data, pdf=False)
    h = h.replace('<script src="scorm.js"></script>', "<script>" + open(os.path.join(ENG, "scorm.js")).read() + "</script>")
    h = h.replace('<script src="data.js"></script>', "<script>window.COURSE=" + json.dumps(d, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/") + ";</script>")
    h = h.replace('<script src="app.js"></script>', "<script>" + app + "</script>")
    h = re.sub(r"<!doctype html>\s*<html[^>]*>\s*<head>", "", h, flags=re.I)
    h = re.sub(r'<meta charset="utf-8">\s*<meta name="viewport"[^>]*>\s*', "", h)
    for t in ("</head>", "<body>", "</body>", "</html>"): h = h.replace(t, "")
    h = h.replace("<title>Éco-Consultant · Formation en ligne</title>", "<title>Éco-Consultant Parcours</title>")
    open(os.path.join(OUT, "preview.html"), "w").write(h)

def main():
    mods, g = load()
    os.makedirs(OUT, exist_ok=True)
    pdfdir = os.path.join(OUT, "pdf")
    if "--no-pdf" not in sys.argv:
        shutil.rmtree(pdfdir, ignore_errors=True); os.makedirs(pdfdir)
        jobs = pdf_jobs(mods, g); asyncio.run(render_pdfs(jobs, pdfdir)); print(f"PDF : {len(jobs)}")
    heygen(mods)
    full = {"modules": [1, 2, 3, 4, 5], "start": True, "end": True}
    write_pkg(os.path.join(OUT, "site"), course(mods, g, full, True), False, "", "")
    sd = os.path.join(OUT, "scorm"); shutil.rmtree(sd, ignore_errors=True); os.makedirs(sd)
    tmp = os.path.join(OUT, "_pkg")
    write_pkg(tmp, course(mods, g, full, False), True, "Éco-Consultant — Parcours complet (5 modules, 34 capsules)", "ECO-CONSULTANT-PARCOURS-v3")
    zipdir(tmp, os.path.join(sd, f"ECO-CONSULTANT_Parcours-complet_SCORM12_v{VERSION}.zip"))
    for m in mods:
        sc = {"modules": [m["id"]], "start": False, "end": False}
        write_pkg(tmp, course(mods, g, sc, False), True, f"Éco-Consultant — Module {m['id']} · {m['title']}", f"ECO-CONSULTANT-M{m['id']}-v3")
        zipdir(tmp, os.path.join(sd, f"ECO-CONSULTANT_M{m['id']}_{SLUG[m['id']]}_SCORM12_v{VERSION}.zip"))
    shutil.rmtree(tmp)
    preview_file(course(mods, g, full, True))
    n = sum(len(m["capsules"]) for m in mods)
    words = sum(len(re.findall(r"\w+", s["voice"])) for m in mods for c in m["capsules"] for s in c["video"]["segments"])
    print(f"OK : {n} capsules, {words} mots de voix (≈ {round(words / 140)} min) ; paquets : {', '.join(sorted(os.listdir(sd)))}")

if __name__ == "__main__": main()
