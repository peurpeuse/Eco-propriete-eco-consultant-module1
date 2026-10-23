/* Version en ligne (Vercel + Supabase) de la page de validation.
   Remplace les capacités claude.ai (db, user, mcp) par :
   - connexion : identifiant + mot de passe (comptes Supabase créés par le responsable du projet)
   - avis : table public.avis (un document par personne, mises à jour en direct)
   - journal : table public.journal, rempli automatiquement à chaque enregistrement (qui a modifié quoi, quand)
   - état publié par Claude (corrections reportées, mises en production) : /api/state, fusionné à data.json
   - « Envoyer en production » : la demande est enregistrée dans l'avis du décideur ; Claude la prend en charge
     à sa vérification en ligne. */
(function () {
  "use strict";
  var SUPABASE_JS = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js";
  var MAIL_DOMAIN = "validation.eco-propriete.pro";   // identifiant « Sebastien » → sebastien@validation.eco-propriete.pro
  var API = location.origin;                            // la page peut être servie via <base> : l'API reste sur l'adresse Vercel
  var ROLE_NAME = { DIR: "Décideur", FORM: "Formateur", JUR: "Juriste / notaire", TECH: "Technique bâtiment", FIN: "Financement", VID: "Vidéo" };
  var PARTS = { video: "Vidéo", quiz: "Quiz", fiche: "Fiche", exo: "Exercice", livrable: "Livrable", module: "Module" };

  // ---------- data.json + état publié par Claude ----------
  var ofetch = window.fetch.bind(window);
  window.fetch = function (u, o) {
    if (u === "data.json") {
      return Promise.all([ofetch(window.EV_DATA_URL || "data.json", { cache: "no-store" }).then(function (r) { return r.json(); }),
        ofetch(API + "/api/state", { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; })])
        .then(function (a) {
          var d = a[0], s = a[1] || {};
          d.applied = Object.assign({}, d.applied || {}, s.applied || {});
          d.prod = Object.assign({}, d.prod || {}, s.prod || {});
          return new Response(JSON.stringify(d), { headers: { "Content-Type": "application/json" } });
        });
    }
    return ofetch(u, o);
  };

  function loadScript(src) { return new Promise(function (ok, ko) { var s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = ko; document.head.appendChild(s); }); }
  function toEmail(id) {
    id = String(id || "").trim();
    if (id.indexOf("@") > 0) return id.toLowerCase();
    return id.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9._-]/g, "") + "@" + MAIL_DOMAIN;
  }
  function niceName(user) {
    var m = (user.user_metadata && (user.user_metadata.name || user.user_metadata.full_name)) || "";
    if (m) return m;
    var l = (user.email || "").split("@")[0].replace(/[._-]+/g, " ");
    return l.replace(/\b\w/g, function (c) { return c.toUpperCase(); }) || "Quelqu'un";
  }

  // ---------- écran de connexion ----------
  function loginForm(sb) {
    return new Promise(function (ok) {
      var wrap = document.createElement("div");
      wrap.setAttribute("style", "position:fixed;inset:0;z-index:30;background:var(--bg,#F3F7F4);display:flex;align-items:center;justify-content:center;padding:16px");
      wrap.innerHTML = '<form style="background:var(--surface,#fff);color:var(--fg,#16241C);border:1px solid var(--line,#D5E2DA);border-radius:16px;padding:24px;max-width:400px;width:100%;display:flex;flex-direction:column;gap:12px;font:inherit">' +
        '<b style="font-size:22px">Validation de la formation</b><span style="color:var(--muted,#56675D)">Connecte-toi avec l\'identifiant et le mot de passe que t\'a donnés le responsable du projet.</span>' +
        '<label style="font-weight:700">Identifiant<input name="u" required autocomplete="username" autocapitalize="none" style="display:block;width:100%;margin-top:4px;font:inherit;font-size:17px;padding:12px;border-radius:10px;border:2px solid var(--line,#D5E2DA);background:var(--surface,#fff);color:inherit"></label>' +
        '<label style="font-weight:700">Mot de passe<input name="p" type="password" required autocomplete="current-password" style="display:block;width:100%;margin-top:4px;font:inherit;font-size:17px;padding:12px;border-radius:10px;border:2px solid var(--line,#D5E2DA);background:var(--surface,#fff);color:inherit"></label>' +
        '<p class="err" role="alert" style="margin:0;color:var(--red,#C62828);font-weight:700" hidden></p>' +
        '<button style="font:inherit;font-weight:700;font-size:17px;padding:13px;border-radius:12px;border:0;background:var(--green,#1A7A44);color:#fff;cursor:pointer">Se connecter</button></form>';
      var f = wrap.querySelector("form"), err = wrap.querySelector(".err"), btn = wrap.querySelector("button");
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        err.hidden = true; btn.disabled = true; btn.textContent = "Connexion…";
        sb.auth.signInWithPassword({ email: toEmail(f.u.value), password: f.p.value }).then(function (r) {
          btn.disabled = false; btn.textContent = "Se connecter";
          if (r.error || !r.data || !r.data.user) {
            err.textContent = /invalid/i.test((r.error && r.error.message) || "") ? "Identifiant ou mot de passe incorrect." : "Connexion impossible pour l'instant. Réessaie dans un instant.";
            err.hidden = false; return;
          }
          wrap.remove(); ok(r.data.user);
        });
      });
      document.body.appendChild(wrap);
      setTimeout(function () { f.u.focus(); }, 50);
    });
  }

  // ---------- journal : ce qui a changé entre deux versions d'un avis ----------
  function refLabel(ref) {
    var R = { obj: "Objectif", fiche: "Fiche PDF", entree: "Module · entrée → sortie", cas: "Cas pratique · énoncé", "ex:contexte": "Exercice · consigne" };
    if (R[ref]) return R[ref];
    var p = String(ref).split(":"), k = p.shift(), v = p.join(":");
    return ({ seg: "Script · " + v, q: "Quiz · question " + v, ex: "Exercice · étape " + v, liv: "Livrable · critère " + v })[k] || ref;
  }
  function diff(prev, next) {
    var out = [], a0 = prev || {}, b0 = next || {};
    var push = function (item, ref, action, before, after, detail) { out.push({ item_id: item || null, ref: ref || null, action: action, before: before == null ? null : String(before), after: after == null ? null : String(after), detail: detail || null }); };
    if ((a0.role || "") !== (b0.role || "") && b0.role) push(null, null, "a choisi le rôle « " + (ROLE_NAME[b0.role] || b0.role) + " »");
    var ai = a0.items || {}, bi = b0.items || {}, ids = {};
    Object.keys(ai).concat(Object.keys(bi)).forEach(function (k) { ids[k] = 1; });
    Object.keys(ids).forEach(function (id) {
      var a = ai[id], b = bi[id];
      if (a && !b) { push(id, null, "a réinitialisé ses changements"); return; }
      a = a || {}; b = b || {};
      if (a.s !== b.s && b.s) push(id, null, b.s === "ok" ? "a validé" : "a envoyé des corrections");
      if (a.s && !b.s && !Object.keys(b.edits || {}).length) push(id, null, "a remis l'élément « à valider »");
      var ae = a.edits || {}, be = b.edits || {};
      Object.keys(Object.assign({}, ae, be)).forEach(function (r) {
        if (!ae[r] && be[r]) push(id, r, "a réécrit « " + refLabel(r) + " »", be[r].before, be[r].after);
        else if (ae[r] && be[r] && ae[r].after !== be[r].after) push(id, r, "a modifié sa version de « " + refLabel(r) + " »", ae[r].after, be[r].after);
        else if (ae[r] && !be[r]) push(id, r, "a retiré sa version de « " + refLabel(r) + " »", ae[r].after, null);
      });
      var ap = a.parts || {}, bp = b.parts || {};
      Object.keys(Object.assign({}, ap, bp)).forEach(function (p) {
        var x = ap[p] || {}, y = bp[p] || {};
        // « Tout valider » marque toutes les parties OK d'un coup : une seule ligne « a validé » suffit
        if (x.s !== y.s && y.s && !(y.s === "ok" && a.s !== b.s)) push(id, "part:" + p, "a marqué « " + (PARTS[p] || p) + " » " + (y.s === "ok" ? "OK" : "à corriger"));
        if ((x.note || "") !== (y.note || "") && y.note) push(id, "part:" + p, "a commenté « " + (PARTS[p] || p) + " »", x.note || null, y.note);
      });
      if ((a.note || "") !== (b.note || "") && b.note) push(id, null, "a laissé une remarque générale", a.note || null, b.note);
      var aa = a.asks || {}, ba = b.asks || {};
      Object.keys(Object.assign({}, aa, ba)).forEach(function (r) {
        if (ba[r] && (!aa[r] || aa[r].q !== ba[r].q)) push(id, r, "a posé une question au rôle « " + (ROLE_NAME[ba[r].role] || ba[r].role) + " » sur « " + refLabel(r) + " »", null, ba[r].q);
        else if (aa[r] && !ba[r]) push(id, r, "a retiré sa question sur « " + refLabel(r) + " »");
      });
      var an = a.answers || {}, bn = b.answers || {};
      Object.keys(bn).forEach(function (k) { if (!an[k] || an[k].text !== bn[k].text) push(id, k.split("|").slice(1).join("|"), "a répondu à une question sur « " + refLabel(k.split("|").slice(1).join("|")) + " »", null, bn[k].text); });
      var ac = a.choix || {}, bc = b.choix || {};
      Object.keys(bc).forEach(function (r) { if (ac[r] !== bc[r]) push(id, r, bc[r] === "orig" ? "a gardé le texte d'origine pour « " + refLabel(r) + " »" : "a retenu une version pour « " + refLabel(r) + " »", null, null, { choix: bc[r] }); });
      var ar = a.revert || {}, br = b.revert || {};
      Object.keys(Object.assign({}, ar, br)).forEach(function (r) {
        if (br[r] && !ar[r]) push(id, r, "a demandé le retour à l'ancien texte pour « " + refLabel(r) + " »");
        else if (ar[r] && !br[r]) push(id, r, "a annulé le retour à l'ancien texte pour « " + refLabel(r) + " »");
      });
    });
    var ap0 = a0.prod || {}, bp0 = b0.prod || {};
    Object.keys(Object.assign({}, ap0, bp0)).forEach(function (k) {
      if (bp0[k] && (!ap0[k] || ap0[k].at !== bp0[k].at)) push(String(k), null, "a envoyé en production " + (/\./.test(k) ? "la capsule " + k : "le module " + k));
      else if (ap0[k] && !bp0[k]) push(String(k), null, "a annulé la mise en production de " + (/\./.test(k) ? "la capsule " + k : "le module " + k));
    });
    return out;
  }

  // ---------- démarrage ----------
  var ready = ofetch(API + "/api/config", { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (cfg) {
    if (!cfg.url || !cfg.key) throw new Error("config");
    return loadScript(SUPABASE_JS).then(function () {
      var sb = window.supabase.createClient(cfg.url, cfg.key, { auth: { persistSession: true, autoRefreshToken: true, storageKey: "ev-auth" } });
      return sb.auth.getSession().then(function (r) {
        var u = r.data && r.data.session && r.data.session.user;
        return (u ? Promise.resolve(u) : loginForm(sb)).then(function (user) {
          sb.auth.onAuthStateChange(function (ev) { if (ev === "SIGNED_OUT") location.reload(); });
          return { sb: sb, user: user, name: niceName(user) };
        });
      });
    });
  });
  ready.catch(function () {});

  var docs = {}, saved = {};   // docs : avis de l'équipe ; saved : dernière version enregistrée de MON avis (pour le journal)

  function rowToDoc(r) { var d = JSON.parse(JSON.stringify(r.doc || {})); d.name = r.name || d.name || ""; d.role = r.role || d.role || ""; return d; }

  var db = {
    doc: function (path) {
      return {
        set: function (body) {
          return ready.then(function (c) {
            var uid = c.user.id, doc = JSON.parse(JSON.stringify(body)); doc.name = c.name;
            var changes = diff(saved[uid], doc);
            return c.sb.from("avis").upsert({ user_id: uid, name: c.name, role: doc.role || "", doc: doc }).then(function (r) {
              if (r.error) throw { code: "unavailable", message: r.error.message };
              saved[uid] = doc; docs[uid] = doc;
              if (changes.length) c.sb.from("journal").insert(changes.map(function (x) { x.user_id = uid; x.user_name = c.name; return x; })).then(function () {});
            });
          });
        }
      };
    },
    collection: function () {
      return {
        onSnapshot: function (cb, err) {
          var stop = false, ch = null;
          var emit = function () { if (!stop) cb({ docs: Object.keys(docs).map(function (k) { return { id: k, exists: true, data: function () { return JSON.parse(JSON.stringify(docs[k])); } }; }) }); };
          var load = function () {
            return ready.then(function (c) {
              return c.sb.from("avis").select("user_id,name,role,doc,updated_at").then(function (r) {
                if (r.error) throw r.error;
                var me = c.user.id;
                (r.data || []).forEach(function (row) { docs[row.user_id] = rowToDoc(row); });
                if (!saved[me]) saved[me] = docs[me] ? JSON.parse(JSON.stringify(docs[me])) : {};
                emit();
              });
            }).catch(function (e) { if (err && !stop) err(e); });
          };
          load().then(function () {
            ready.then(function (c) {
              ch = c.sb.channel("avis-direct").on("postgres_changes", { event: "*", schema: "public", table: "avis" }, function (p) {
                if (p.new && p.new.user_id && p.new.user_id !== c.user.id) { docs[p.new.user_id] = rowToDoc(p.new); emit(); }
              }).subscribe();
            });
          });
          var t = setInterval(function () { if (!document.hidden) load(); }, 60000);   // filet de sécurité si le direct coupe
          return function () { stop = true; clearInterval(t); if (ch) ch.unsubscribe(); };
        }
      };
    }
  };
  var user = {
    me: function () { return ready.then(function (c) { return { id: c.user.id, name: c.name, avatarUrl: "", email: c.user.email }; }); },
    id: function () { return ready.then(function (c) { return c.user.id; }); },
    can: function () { return ready.then(function () { return true; }); },
    isOwner: function () { return Promise.resolve(false); },
    profiles: function (ids) {
      var o = {};
      ids.forEach(function (i) { o[i] = { id: i, name: (docs[i] && docs[i].name) || "", avatarUrl: "" }; });
      return Promise.resolve(o);
    }
  };
  // journal consultable sur la page (absent dans la version claude.ai)
  var journal = {
    list: function (opts) {
      opts = opts || {};
      return ready.then(function (c) {
        var q = c.sb.from("journal").select("id,at,user_id,user_name,item_id,ref,action,before,after").order("at", { ascending: false }).limit(opts.limit || 300);
        if (opts.item) q = q.eq("item_id", opts.item);
        if (opts.user) q = q.eq("user_id", opts.user);
        return q.then(function (r) { if (r.error) throw r.error; return r.data || []; });
      });
    },
    onNew: function (cb) {
      return ready.then(function (c) {
        var ch = c.sb.channel("journal-direct").on("postgres_changes", { event: "INSERT", schema: "public", table: "journal" }, function (p) { cb(p.new); }).subscribe();
        return function () { ch.unsubscribe(); };
      });
    },
    logout: function () { return ready.then(function (c) { return c.sb.auth.signOut(); }).then(function () { location.reload(); }); },
    who: function () { return ready.then(function (c) { return { id: c.user.id, name: c.name }; }); }
  };
  var mcp = { callTool: function (s, tool) { return tool === "fire_trigger" ? Promise.resolve({ payload: { queued: true } }) : Promise.reject({ code: "not_in_manifest" }); } };

  window.claude = { use: function (n) {
    if (n === "mcp") return Promise.resolve(mcp);
    if (n === "db" || n === "user" || n === "journal") return ready.then(function () { return n === "db" ? db : n === "user" ? user : journal; }).catch(function () { return null; });
    return Promise.resolve(null);
  } };
})();
