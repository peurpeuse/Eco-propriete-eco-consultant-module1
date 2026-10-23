"""Récapitulatif des validations (Markdown) pour le fichier Google Drive que Claude lit avant toute production.
Usage : python3 recap_supabase.py avis.json SIGNATURE [journal.json] > Validations.md
  avis.json    : résultat de  select json_agg(json_build_object('user_id',user_id,'name',name,'role',role,'doc',doc,'updated_at',updated_at)) from public.avis
  SIGNATURE    : md5 calculé par la même requête de vérification (sert à savoir si quelque chose a changé)
  journal.json : (facultatif) dernières lignes de public.journal en JSON
Lit validation-site/data.json et v3-src/validation/state.json depuis le dépôt (chemins relatifs à ce fichier).
"""
import json, os, re, sys
from datetime import datetime, timezone, timedelta

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
ROLES = {"DIR": "Décideur", "FORM": "Formateur", "JUR": "Juriste / notaire", "TECH": "Technique bâtiment", "FIN": "Financement", "VID": "Vidéo"}
PARTS = {"video": "Vidéo", "quiz": "Quiz", "fiche": "Fiche", "exo": "Exercice", "livrable": "Livrable", "module": "Module"}
REF = {"obj": "Objectif", "fiche": "Fiche PDF", "entree": "Module · entrée → sortie", "cas": "Cas pratique · énoncé", "ex:contexte": "Exercice · consigne"}
MAROC = timezone(timedelta(hours=0))  # Africa/Casablanca (UTC+0 hors ramadan)


def ref_label(ref):
    if ref in REF:
        return REF[ref]
    k, _, v = ref.partition(":")
    return {"seg": "Script · " + v, "q": "Quiz · question " + v, "ex": "Exercice · étape " + v, "liv": "Livrable · critère " + v}.get(k, ref)


def fr(iso):
    if not iso:
        return "?"
    d = datetime.fromisoformat(str(iso).replace("Z", "+00:00")).astimezone(MAROC)
    return d.strftime("%d/%m/%Y %H:%M")


def q(t):
    return re.sub(r"\s+", " ", str(t or "")).strip()


def main():
    rows = json.load(open(sys.argv[1])) or []
    sig = sys.argv[2] if len(sys.argv) > 2 else "?"
    jrn = json.load(open(sys.argv[3])) if len(sys.argv) > 3 else []
    data = json.load(open(os.path.join(REPO, "validation-site", "data.json")))
    try:
        state = json.load(open(os.path.join(REPO, "v3-src", "validation", "state.json")))
    except Exception:
        state = {"applied": {}, "prod": {}}
    team = {}
    for r in rows:
        d = dict(r.get("doc") or {})
        d["name"] = r.get("name") or d.get("name") or ""
        d["role"] = r.get("role") or d.get("role") or ""
        if d["role"]:
            team[r["user_id"]] = d
    who = lambda u: (q(team.get(u, {}).get("name")) or "Quelqu'un") + " (" + ROLES.get(team.get(u, {}).get("role"), "?") + ")"
    items = data.get("items", [])
    by_id = {it["id"]: it for it in items}
    key_name = lambda k: ("Capsule " + k + " · " + by_id.get(k, {}).get("title", "")) if "." in str(k) else ("Module " + str(k) + " (toutes ses capsules)")

    last = None
    for d in team.values():
        for r in (d.get("items") or {}).values():
            for t in [r.get("at")] + [e.get("at") for e in (r.get("edits") or {}).values()]:
                if t and (not last or t > last):
                    last = t
    pending = []
    for u, d in team.items():
        if d.get("role") != "DIR":
            continue
        for k, p in (d.get("prod") or {}).items():
            done = (state.get("prod") or {}).get(str(k))
            if not done or str(done.get("at", "")) < str(p.get("at", "")):
                pending.append({"key": str(k), "at": p.get("at"), "by": u})

    L = ["# Validations Éco-Consultant — état au " + fr(datetime.now(timezone.utc).isoformat()), "",
         "Signature : " + sig + " · dernière modification : " + fr(last) + " · page : https://eco-consultant-validation.vercel.app", "",
         "> Fichier généré automatiquement depuis la page de validation en ligne (Supabase). Claude le lit avant toute mise en production : il applique les corrections listées ici pour l'élément envoyé, puis produit (vidéo, fiches PDF, SCORM, publication). Tant qu'un élément n'est pas envoyé en production, rien n'est créé.", "",
         "## Équipe"]
    if not team:
        L.append("- Personne n'a encore donné d'avis.")
    for u, d in team.items():
        its = list((d.get("items") or {}).values())
        L.append("- " + who(u) + " : " + str(sum(1 for r in its if r.get("s") == "ok")) + " validé(s), " + str(sum(1 for r in its if r.get("s") == "fix")) + " avec corrections")
    L += ["", "## 🚀 Demandes de mise en production en attente"]
    if not pending:
        L.append("- Aucune.")
    for p in pending:
        L.append("- [" + p["key"] + "] " + key_name(p["key"]) + " — demandée par " + who(p["by"]) + " le " + fr(p["at"]))
    L += ["", "## Détail par élément"]
    anyone = False
    for it in items:
        lines = []
        for u, d in team.items():
            r = (d.get("items") or {}).get(it["id"])
            if not r:
                continue
            s = r.get("s")
            lines.append("- " + who(u) + " : " + ("✓ validé" if s == "ok" else "✏️ corrections" if s == "fix" else "en cours") + (" (" + fr(r.get("at")) + ")" if r.get("at") else ""))
            for p, v in (r.get("parts") or {}).items():
                if v.get("s") == "fix":
                    lines.append("  - Partie à corriger : " + PARTS.get(p, p) + (" — « " + q(v.get("note")) + " »" if v.get("note") else ""))
            if r.get("note"):
                lines.append("  - Remarque générale : « " + q(r["note"]) + " »")
            for ref, e in (r.get("edits") or {}).items():
                lines.append("  - Passage « " + ref_label(ref) + " » [" + ref + "]\n    - AVANT : " + q(e.get("before")) + "\n    - APRÈS : " + q(e.get("after")))
            for ref, a in (r.get("asks") or {}).items():
                lines.append("  - Question à " + ROLES.get(a.get("role"), a.get("role", "?")) + " sur « " + ref_label(ref) + " » : « " + q(a.get("q")) + " »")
            for k, a in (r.get("answers") or {}).items():
                uq, _, ref = k.partition("|")
                lines.append("  - Réponse (question de " + who(uq) + " sur « " + ref_label(ref) + " ») : « " + q(a.get("text")) + " »")
            for ref, c in (r.get("choix") or {}).items():
                lines.append("  - Choix du décideur pour « " + ref_label(ref) + " » : " + ("garder le texte d'origine" if c == "orig" else "version de " + who(c)))
            for ref in (r.get("revert") or {}):
                lines.append("  - Retour à l'ancien texte demandé : « " + ref_label(ref) + " »")
        if lines:
            anyone = True
            L += ["", "### " + ("Module " + str(it["mod"]) + " · " + it["title"] if it["kind"] == "module" else "Capsule " + it["id"] + " · " + it["title"])] + lines
    if not anyone:
        L.append("- Aucun avis pour l'instant.")
    if jrn:
        L += ["", "## Journal récent (qui a modifié quoi)"]
        for j in jrn[:60]:
            L.append("- " + fr(j.get("at")) + " · " + q(j.get("user_name")) + " " + q(j.get("action")) + ((" · " + str(j["item_id"])) if j.get("item_id") else ""))
    L += ["", "## Données brutes (pour Claude)", "", "```json", json.dumps({"signature": sig, "pending": pending, "docs": team}, ensure_ascii=False), "```", ""]
    sys.stdout.write("\n".join(L))


if __name__ == "__main__":
    main()
