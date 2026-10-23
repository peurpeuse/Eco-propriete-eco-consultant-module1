"""Génère la version en ligne (Vercel) de la page de validation à partir de la page claude.ai.
Usage : python3 build_web.py   →   dist/ prêt à déployer (index.html, data.json, logos, api/, package.json, vercel.json)
"""
import os, shutil, json
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(os.path.dirname(HERE), "validation")
DIST = os.path.join(HERE, "dist")
shutil.rmtree(DIST, ignore_errors=True)
os.makedirs(os.path.join(DIST, "api"))

page = open(os.path.join(SRC, "index.html"), encoding="utf-8").read()
# textes propres à claude.ai → version en ligne
SUBS = [
    ("demande au propriétaire de te donner l'accès « Contributeur » à cette page.", "ouvre le lien complet reçu (il contient la clé d'accès de l'équipe)."),
    ("Tes choix ne peuvent pas être enregistrés ici (connexion indisponible). Ouvre la page depuis claude.ai, connecté à ton compte.",
     "Tes choix ne peuvent pas être enregistrés : il manque la clé d'accès. Ouvre le lien complet reçu (avec #k=…)."),
    ("🚀 Production lancée le ", "🚀 Envoyé en production le "),
    ("compte rendu par notification", "Claude le prend en charge dans l'heure"),
    ("lancé à la relève de 18h", "pris en charge dans l'heure"),
    ("elle partira à la relève de 18h", "Claude la prendra à sa prochaine vérification (toutes les heures)"),
    ("Dès que tu confirmes, Claude lance la production de ", "Dès que tu confirmes, la demande part et Claude lance dans l'heure la production de "),
]
for a, b in SUBS:
    page = page.replace(a, b)
shim = open(os.path.join(HERE, "shim.js"), encoding="utf-8").read()
html = ('<!doctype html><html lang="fr"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
        '<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#1A7A44">'
        '<script>' + shim + '</script></head><body>' + page + '</body></html>')
open(os.path.join(DIST, "index.html"), "w", encoding="utf-8").write(html)
for f in ["data.json", "logo-ec-dark.png", "logo-ec-white.png"]:
    shutil.copy(os.path.join(SRC, f), DIST)
for f in ["package.json", "vercel.json"]:
    shutil.copy(os.path.join(HERE, f), DIST)
for f in os.listdir(os.path.join(HERE, "api")):
    shutil.copy(os.path.join(HERE, "api", f), os.path.join(DIST, "api"))
print("dist prêt :", sorted(os.listdir(DIST)), "· index.html", len(html) // 1024, "Ko")
