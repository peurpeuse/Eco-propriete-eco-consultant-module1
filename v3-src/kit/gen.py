import json, glob, os, re, sys
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT); import build
CON=os.path.join(ROOT,'content'); OUT=os.path.join(ROOT,'kit','out','Kit_modification_Eco-Consultant_v3')
os.makedirs(OUT, exist_ok=True)
mods, G = build.load(); META = build.META
ROLES = {'FORM':'Formateur (Seb) — pédagogie, ton, script', 'JUR':'Juriste / notaire — droit immobilier', 'TECH':'Expert technique — diagnostiqueur, thermicien, bâtiment',
         'FIN':'Expert financement — courtier, crédit, aides', 'VID':'Responsable vidéo — tournage, montage, visuels', 'DIR':'Direction / coordination — offre, marque, cohérence'}
SLUG = {1:'Se-differencier',2:'Estimer',3:'Exclusivite',4:'Compromis',5:'Securiser'}
def q(s): return str(s).replace('\n',' ').strip()
def zone(zid, roles, rules, what='cet élément'):
    r = ' · '.join(f'`{x}`' for x in roles)
    return f'''
<!-- ✏️ ZONE {zid} — DÉBUT -->
> ### ✏️ À REMPLIR · `{zid}`
> **Intervenants concernés :** {r}
> **📏 Règles à respecter :** {rules}
>
> **Rempli par (nom + rôle) :** ✏️
> **Décision :** [ ] OK tel quel  [ ] À modifier  [ ] À réécrire entièrement  [ ] À supprimer
> **Ce qui ne va pas / ce qu'il faut changer :**
> ✏️
>
> **Texte exact à utiliser (si tu l'as) — sinon Claude rédige à partir de tes consignes :**
> ✏️
>
> **Source ou justification (loi, article, URL, expérience terrain) :**
> ✏️
<!-- ✏️ ZONE {zid} — FIN -->
'''
def role_of(txt):
    t=txt.lower(); r=[]
    if re.search(r'jurid|art\.|loi|hoguet|cch|code |notaire|mention', t): r.append('JUR')
    if re.search(r'technic|diagnost|vmc|termite|amiante|pont thermique|dpe|3cl|kwh|ademe|bruit', t): r.append('TECH')
    if re.search(r'financ|prêt|taux|assurance|hcsf|ptz|maprimer|iobsp|cgi|tva', t): r.append('FIN')
    if re.search(r'tournage|google|linkedin|meta|facebook', t): r.append('VID')
    if re.search(r'coordination|modèle de mandat|agence|disc', t): r.append('DIR')
    return r or ['FORM']
ABBR={'art','l','r','d','cass','n°','cf','ex','etc','av','j','m','mme','p','civ','al','min','env','réf'}
def sentences(t):
    out=[]; start=0
    for mt in re.finditer(r'\.\s+(?=[A-ZÀ-Ý\[«(0-9])', t):
        prev=re.findall(r'([\wé°]+)$', t[:mt.start()])
        if prev and (prev[0].lower() in ABBR or re.fullmatch(r'\d+', prev[0]) and t[mt.end():mt.end()+1].isdigit()): continue
        out.append(t[start:mt.start()+1]); start=mt.end()
    out.append(t[start:]); return [x.strip() for x in out if x.strip()]
def points(notes):
    out=[]
    for h in [y for x in re.split(r'\s\|\s|\n+', notes or '') for y in sentences(x)]:
        if re.search(r'VALIDER|[Rr]electure|revérifier|à confirmer|à vérifier', h): out.append(h.strip())
    return out
def secs_md(secs):
    s=''
    for x in secs or []:
        s += f"\n**{x.get('heading','')}**\n\n"
        t=x.get('type')
        if t=='table':
            h=x.get('headers',[]); s+='| '+' | '.join(map(q,h))+' |\n|'+'---|'*len(h)+'\n'
            for r in x.get('rows',[]): s+='| '+' | '.join(q(c).replace('|','/') for c in r)+' |\n'
        elif t in ('list','checklist','steps'):
            for i,it in enumerate(x.get('items',[])): s+=(f'{i+1}. ' if t=='steps' else ('- [ ] ' if t=='checklist' else '- '))+q(it)+'\n'
        if x.get('text'): s+='\n'+x['text'].strip()+'\n'
    return s
def mcq_md(qs, start=1):
    s=''
    for i,x in enumerate(qs):
        s+=f"\n**Q{start+i}. {q(x['question'])}**" + (f"  _(module {x['module']})_" if 'module' in x else '') + '\n'
        for j,o in enumerate(x['options']):
            ok = j==x['answer']; why=(x.get('whys') or [''])[j] if j < len(x.get('whys') or []) else ''
            s+=f"- {'✅' if ok else '◻️'} {chr(65+j)}. {q(o)}" + (f" — _{q(why)}_" if why else '') + '\n'
        if x.get('fb_title'): s+=f"- 💬 Feedback : **{q(x['fb_title'])}** — {q(x.get('fb_text',''))}\n"
    return s

R_GEN='Titre ≤ 90 caractères, objectif ≤ 200 caractères, formulé « À la fin, tu sauras… ». Tutoiement. Ne pas changer le numéro de capsule.'
R_VID='8 minutes = 980 à 1 300 mots de voix (≈ 1 100), 6 à 14 segments horodatés. Structure : accroche 20 s (M. Bernard ou chiffre fort) → pourquoi c’est important → 3 idées clés max illustrées sur le fil rouge → démonstration sur les documents D01-D20 → erreurs fréquentes → ce que tu fais maintenant. Oral, phrases courtes, « tu », aucune URL à l’oral. Pour chaque segment : ce qu’on voit à l’écran (consigne de montage) + texte incrusté ≤ 140 car. Pour corriger une phrase, cite le minutage (ex. « 03:20 : remplacer … par … »).'
R_QUIZ='4 à 5 questions, 3 ou 4 options chacune (≤ 140 car.), une seule bonne réponse, position variée. Au moins 2 questions en situation sur le dossier de M. Bernard. Pour chaque option : une phrase « pourquoi juste / pourquoi faux » (15-240 car.) + un feedback (titre ≤ 80 car., explication 40-450 car.). Ne pas reprendre les questions des rappels ni du quiz final.'
R_RES='Fiche utilisable telle quelle en rendez-vous : ≥ 250 mots utiles, 3 à 9 sections (liste, check-list, étapes, tableau ≤ 6 colonnes, texte, formule + exemple chiffré). Sources et date en pied de page. Tout fait réglementaire doit avoir une source officielle (Légifrance, service-public, ANIL, ADEME, CNIL…).'
R_EX='Titre conservé. Contexte sur le fil rouge, documents à utiliser (codes D01-D20), 3 à 8 étapes, durée réaliste en minutes, corrigé chiffré ≥ 200 car. Capsule IA : prompt complet (rôle, contexte, tâche, format, contraintes, données du fil rouge à coller) ≥ 300 car. + au moins 2 garde-fous (RGPD, relecture humaine, vérification des chiffres).'
R_DEP='Ce que l’apprenant dépose + format précis (ex. « PDF, 1 page ») + 4 à 7 critères vérifiables par le formateur (pas « bonne qualité » mais « les 3 postes sont chiffrés avec quantité, prix unitaire et source »).'
R_VAL='Pour chaque point : coche « validé » ou écris la correction exacte + la source. Un point non tranché reste signalé « à valider » dans la formation.'
R_CASE='Énoncé ≥ 400 caractères, 4 à 10 tâches, 4 à 10 critères avec points et attendu. Mobilise toutes les capsules du module et produit la « sortie » du module.'
R_REM='3 envois (J+1, J+7, J+30) : objet d’e-mail, message court, SMS ≤ 160 caractères, 2 à 3 QCM de rappel (différents du quiz flash).'
R_MOD='Titre, point d’entrée et sortie du module (une ligne chacun). Le code couleur DPE (rouge → vert) reste fixe.'
R_NEW='Décris la capsule ou la question à ajouter (titre, objectif, idées clés, exercice, livrable). Claude la rédige au format complet. Attention : une capsule de plus = 8 min de vidéo de plus.'

def capsule_md(c):
    v=c['video']; x=c['exercise']; d=c['deliverable']; r=c['resource']; cid=c['id']
    words=sum(len(re.findall(r'\w+',s['voice'])) for s in v['segments'])
    s=f"\n---\n\n## Capsule {cid} · {c['title']}" + (' · 🤖 IA' if c['ia'] else '') + '\n\n'
    s+=f"**Objectif :** {c['objective']}\n\n"
    s+='### 0. Titre et objectif\n'+zone(f'{cid}-general',['FORM','DIR'],R_GEN)
    s+=f"\n### ① Je regarde — vidéo de 8 min ({words} mots de voix, {len(v['segments'])} segments)\n\n**Accroche :** « {q(v['hook'])} »\n\n<details><summary>📜 Script complet de la vidéo (cliquer pour ouvrir)</summary>\n\n"
    s+='| ⏱ | Voix de Seb | À l’écran (montage) | Texte incrusté |\n|---|---|---|---|\n'
    for g in v['segments']: s+=f"| {g['tc']} | {q(g['voice']).replace('|','/')} | {q(g['screen']).replace('|','/')} | {q(g.get('onscreen','')).replace('|','/')} |\n"
    s+='\n</details>\n'+zone(f'{cid}-video',['FORM','VID'],R_VID)
    s+=f"\n### ② Je me teste — quiz flash ({len(c['quiz']['questions'])} questions, ✅ = bonne réponse)\n"+mcq_md(c['quiz']['questions'])+zone(f'{cid}-quiz',['FORM','JUR','TECH','FIN'],R_QUIZ)
    s+=f"\n### ③ Je télécharge — fiche « {r['title']} »\n\n"+(f"_{q(r.get('intro',''))}_\n\n" if r.get('intro') else '')+'<details><summary>📄 Contenu complet de la fiche</summary>\n'+secs_md(r['sections'])+(f"\n_{q(r.get('footer',''))}_\n" if r.get('footer') else '')+'\n</details>\n'+zone(f'{cid}-ressource',['FORM','JUR','TECH','FIN'],R_RES)
    s+=f"\n### ④ Je pratique — exercice « {x['title']} » ({x['duration_min']} min)\n\n**Contexte :** {q(x['context'])}\n\n"
    if x.get('materials'): s+='**Documents :** '+' · '.join(map(q,x['materials']))+'\n\n'
    s+='**Étapes :**\n'+''.join(f'{i+1}. {q(t)}\n' for i,t in enumerate(x['steps']))
    p=x.get('ia_prompt') or {}
    if p.get('prompt'): s+='\n<details><summary>🤖 Prompt IA fourni à l’apprenant</summary>\n\n```text\n'+p['prompt'].strip()+'\n```\n\n**Garde-fous :**\n'+''.join(f'- {q(g)}\n' for g in p.get('guardrails',[]))+'\n</details>\n'
    s+='\n<details><summary>✅ Corrigé attendu</summary>\n\n'+x['expected'].strip()+'\n\n</details>\n'+zone(f'{cid}-exercice',['FORM','TECH','FIN','JUR'],R_EX)
    s+=f"\n### ⑤ Je dépose — devoir « {d['title']} »\n\n**Format :** {q(d['format'])}\n\n**Critères de validation :**\n"+''.join(f'- {q(k)}\n' for k in d['criteria'])
    if d.get('example'): s+='\n<details><summary>Exemple de livrable réussi</summary>\n\n'+d['example'].strip()+'\n\n</details>\n'
    s+=zone(f'{cid}-devoir',['FORM'],R_DEP)
    pts=points(c.get('notes_prod'))
    s+='\n### 🔍 Points à valider par un expert\n\n'
    if pts:
        for i,h in enumerate(pts): s+=f"- [ ] **P{i+1}** `{'` `'.join(role_of(h))}` — {h}\n  - Réponse de l’expert : ✏️\n"
    else: s+='_Aucun point signalé. Signale ci-dessous tout ce qui te paraît faux ou daté._\n'
    if c.get('sources'): s+='\n<details><summary>Sources actuelles</summary>\n\n'+''.join(f"- {q(z.get('label',''))}" + (f" — {z['url']}" if z.get('url') else '')+'\n' for z in c['sources'])+'\n</details>\n'
    s+=zone(f'{cid}-validation',['JUR','TECH','FIN'],R_VAL)
    return s, pts

rolesidx={k:[] for k in ROLES}
def rem_md(rm):
    s=''
    for t in ('J1','J7','J30'):
        x=rm[t]; s+=f"\n**{t.replace('J','J+')} · {q(x['subject'])}**\n\n> {q(x['message'])}\n\nSMS : « {q(x['sms'])} »\n"+mcq_md(x['questions'])
    return s
for m in mods:
    n=m['id']; k=m['case']
    s=f"# Module {n} · {m['title']}\n\n_Kit de modification · Éco-Consultant v3 · fichier à remplir puis à renvoyer. Lis d’abord `00_LISEZ-MOI.md`._\n\n"
    s+=f"**Couleur DPE :** {build.COLORS[n][1]} · **Entrée :** {m['entry']} · **Sortie :** {m['exit']} · **{len(m['capsules'])} capsules**\n\n"
    s+='## Sommaire\n'+''.join(f"- {c['id']} · {c['title']} {'🤖' if c['ia'] else ''}\n" for c in m['capsules'])+'- Cas pratique du module\n- Rappels J+1 · J+7 · J+30\n- Ajouts\n\n'
    s+='## Le module\n'+zone(f'M{n}-module',['DIR','FORM'],R_MOD)
    for c in m['capsules']:
        cm,pts=capsule_md(c); s+=cm
        for h in pts:
            for r in role_of(h): rolesidx[r].append((c['id'],h))
    s+=f"\n---\n\n## Cas pratique · {k['title']} ({k['duration_min']} min)\n\n{k['brief'].strip()}\n\n**Documents :** "+' · '.join(map(q,k.get('documents',[])))+'\n\n**Tâches :**\n'+''.join(f'{i+1}. {q(t)}\n' for i,t in enumerate(k['tasks']))+f"\n**Livrable :** {q(k['deliverable'])}\n\n**Barème :**\n\n| Critère | Points | Attendu |\n|---|---|---|\n"+''.join(f"| {q(z['label'])} | {z['points']} | {q(z.get('expected','')).replace('|','/')} |\n" for z in k['criteria'])
    s+=zone(f'M{n}-cas',['FORM','DIR','JUR'],R_CASE)
    s+='\n---\n\n## Rappels espacés J+1 · J+7 · J+30\n'+rem_md(m['reminders'])+zone(f'M{n}-rappels',['FORM'],R_REM)
    s+='\n---\n\n## Ajouts (nouvelle capsule, nouvelle question, nouvel exemple)\n'+zone(f'M{n}-ajout',['FORM','DIR','JUR','TECH','FIN','VID'],R_NEW)
    open(f"{OUT}/M{n}_{SLUG[n]}.md",'w').write(s)

# Global
st=G['start']; s='# Début, fin et page d’accueil du cours\n\n_Kit de modification · Éco-Consultant v3. Lis d’abord `00_LISEZ-MOI.md`._\n\n'
s+=f"## Page d’accueil du cours (vitrine)\n\n**Titre :** {META['courseTitle']}\n\n**Présentation :** {META['pitch']}\n\n**Durée affichée :** {META['hours']} · **Formateur :** Seb\n\n**Ce que tu vas apprendre :**\n"+''.join(f"- Module {k} : {v}\n" for k,v in META['objectives'].items())+'\n**Compétences :** '+', '.join(META['skills'])+'\n'
s+=zone('ACCUEIL-vitrine',['DIR','FORM'],'Titre ≤ 70 car. ; présentation 2-3 phrases ; un objectif par module (1 phrase) ; 6 à 12 compétences ; nom complet du formateur et sa bio courte (2 lignes) à fournir ici.')
s+='\n## Bienvenue et mode d’emploi\n\n'+st['welcome'].strip()+'\n\n**Accès à la plateforme :**\n'+''.join(f'{i+1}. {q(t)}\n' for i,t in enumerate(st['platform_steps']))+'\n**Comment fonctionne une capsule :** '+q(st['how_it_works'])+'\n'
s+=zone('DEBUT-bienvenue',['FORM','DIR'],'Ton chaleureux, tutoiement, ≤ 250 mots pour le message. Les étapes d’accès doivent correspondre à la vraie plateforme (LMS) utilisée.')
s+=f"\n## Test de positionnement ({len(G['positioning']['questions'])} questions, 4 par module)\n\n_{q(G['positioning']['intro'])}_\n"+mcq_md(G['positioning']['questions'])+zone('DEBUT-positionnement',['FORM','JUR','TECH','FIN'],'20 questions exactement, 4 par module, même format que les quiz flash.')
s+='\n## Dossier fil rouge de M. Bernard (D01 à D20)\n\n'+q(st['dossier_intro'])+'\n\n⚠️ Les chiffres du dossier sont repris partout dans la formation : un chiffre modifié ici est répercuté par Claude dans toutes les capsules concernées (voir `03_FIL-ROUGE_reference.md`).\n'
for d in G['dossier']['documents']:
    s+=f"\n### {d['id']} · {d['title']}\n\n<details><summary>Contenu actuel</summary>\n"+secs_md(d.get('sections'))+'\n</details>\n'+zone(f"DOSSIER-{d['id']}",['TECH','JUR','FIN','FORM'],'Document fictif mais réaliste ; garder le code Dxx ; cohérent avec la référence fil rouge.')
e=G['end']; s+='\n## Clôture · dossier fil rouge complet\n\n'+q(e['dossier_complet'])+'\n\n| Critère | Points |\n|---|---|\n'+''.join(f"| {q(z['label'])} | {z.get('points','')} |\n" for z in e['criteria'])+'\n**Message de Seb :** '+q(e.get('message',''))+'\n'+zone('FIN-dossier',['FORM','DIR'],'4 à 10 critères avec points.')
f=G['final']; s+=f"\n## Quiz final ({len(f['questions'])} questions, 8 par module, seuil {f['threshold']} %)\n\n_{q(f['intro'])}_\n"+mcq_md(f['questions'])+zone('FIN-quiz-final',['FORM','JUR','TECH','FIN'],'40 questions exactement, 8 par module ; seuil de réussite modifiable (actuellement 70 %).')
sa=G['satisfaction']; s+='\n## Questionnaire de satisfaction\n\n'+''.join(f"{i+1}. {q(x['question'])} _({x['type']})_\n" for i,x in enumerate(sa['questions']))+zone('FIN-satisfaction',['DIR'],'8 à 20 questions ; types : échelle 1-5, choix, texte libre.')
a=G['attestation']; s+=f"\n## Attestation\n\n**Titre :** {a['title']}\n\n```text\n{a['text'].strip()}\n```\n"+zone('FIN-attestation',['DIR','JUR'],'Champs automatiques : {nom}, {date_debut}, {date_fin}, {duree}, {resultat_quiz_final}. Si la formation vise une certification ou la loi ALUR (formation continue des agents), le préciser ici.')
open(f'{OUT}/GLOBAL_debut-fin-accueil.md','w').write(s)

# Roles index
s='# Qui intervient où\n\nChaque intervenant peut remplir **toutes** les zones, mais voici les points qui t’attendent en priorité. Cherche le code de zone (ex. `2.7-validation`) dans le fichier du module.\n'
for r,lab in ROLES.items():
    s+=f"\n## `{r}` · {lab}\n\n"
    if r=='VID': s+='- Toutes les zones `x.x-video` (consignes « À l’écran », texte incrusté, B-roll) et `x.x-general` pour les titres de vignettes.\n'
    if r=='FORM': s+='- Toutes les zones `x.x-video`, `x.x-quiz`, `x.x-exercice`, `x.x-devoir`, les cas pratiques `Mn-cas` et les rappels `Mn-rappels`.\n'
    if r=='DIR': s+='- `ACCUEIL-vitrine`, `Mn-module`, `FIN-attestation`, `FIN-satisfaction`, et l’arbitrage final en cas de désaccord entre intervenants.\n'
    for cid,h in rolesidx[r]: s+=f"- [ ] **{cid}** (zone `{cid}-validation`) — {h}\n"
open(f'{OUT}/04_QUI-INTERVIENT-OU.md','w').write(s)
import shutil; shutil.copy(f'{CON}/BIBLE.md', f'{OUT}/03_FIL-ROUGE_reference.md')
print('ok', {k:len(v) for k,v in rolesidx.items()})
