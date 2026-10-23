/* Version en ligne (Vercel) de la page de validation.
   Remplace les capacités claude.ai (db, user, mcp) par l'API du site :
   - avis : GET/PUT /api/avis (clé d'équipe lue dans le lien #k=…, gardée dans ce navigateur)
   - identité : prénom + nom demandés une fois, identifiant aléatoire gardé dans ce navigateur
   - état publié par Claude (corrections reportées, mises en production) : /api/state, fusionné à data.json
   - « Envoyer en production » : la demande est enregistrée dans l'avis du décideur ; Claude la prend en charge
     à sa vérification en ligne (toutes les heures). */
(function () {
  "use strict";
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var m = /[#&]k=([A-Za-z0-9_-]{16,})/.exec(location.hash || "");
  if (m) { lsSet("ev:key", m[1]); history.replaceState(null, "", location.pathname + location.search); }
  var KEY = lsGet("ev:key") || "";
  // la page peut être servie via une balise <base> (jsDelivr) : l'API reste toujours sur l'adresse Vercel
  var API = location.origin;
  var lastDocs = {};

  // data.json + état publié par Claude
  var ofetch = window.fetch.bind(window);
  window.fetch = function (u, o) {
    if (u === "data.json") {
      return Promise.all([ofetch("data.json", { cache: "no-store" }).then(function (r) { return r.json(); }),
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

  function api(method, body) {
    return ofetch(API + "/api/avis", { method: method, cache: "no-store", headers: { "Content-Type": "application/json", "x-key": KEY }, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) {
        if (r.status === 401) throw { code: "invalid_argument", message: "clé" };
        if (!r.ok) throw { code: "unavailable", message: "HTTP " + r.status };
        return r.json();
      });
  }

  // identité : demandée une fois, gardée dans ce navigateur
  var meP = null;
  function askName() {
    return new Promise(function (ok) {
      var wrap = document.createElement("div");
      wrap.setAttribute("style", "position:fixed;inset:0;z-index:30;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:16px");
      wrap.innerHTML = '<form style="background:var(--surface,#fff);color:var(--fg,#16241C);border-radius:14px;padding:20px;max-width:420px;width:100%;display:flex;flex-direction:column;gap:12px;font:inherit">' +
        '<b style="font-size:20px">Bienvenue 👋</b><span>Pour que l\'équipe sache qui a validé quoi, indique ton prénom et ton nom. On ne te le demandera plus sur cet appareil.</span>' +
        '<input name="n" required minlength="2" placeholder="Prénom Nom" autocomplete="name" style="font:inherit;font-size:17px;padding:12px;border-radius:10px;border:2px solid #1A7A44">' +
        '<button style="font:inherit;font-weight:700;font-size:17px;padding:12px;border-radius:12px;border:0;background:#1A7A44;color:#fff;cursor:pointer">Continuer</button></form>';
      wrap.querySelector("form").addEventListener("submit", function (e) {
        e.preventDefault();
        var n = wrap.querySelector("input").value.trim();
        if (n.length < 2) return;
        lsSet("ev:name", n); wrap.remove(); ok(n);
      });
      document.body.appendChild(wrap);
      setTimeout(function () { wrap.querySelector("input").focus(); }, 50);
    });
  }
  function me() {
    if (!meP) meP = (function () {
      var id = lsGet("ev:uid");
      if (!id) { id = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2)).toLowerCase(); lsSet("ev:uid", id); }
      var n = lsGet("ev:name");
      return (n ? Promise.resolve(n) : askName()).then(function (name) { return { id: id, name: name, avatarUrl: "" }; });
    })();
    return meP;
  }

  var db = {
    doc: function (path) {
      var uid = path.split("/")[1];
      return { set: function (doc) { return me().then(function (u) { doc.name = u.name; return api("PUT", { uid: uid, doc: doc }); }); } };
    },
    collection: function () {
      return {
        onSnapshot: function (cb, err) {
          var stop = false, t = 0;
          var tick = function () {
            api("GET").then(function (r) {
              if (stop) return;
              lastDocs = r.docs || {};
              cb({ docs: Object.keys(lastDocs).map(function (k) { return { id: k, exists: true, data: function () { return JSON.parse(JSON.stringify(lastDocs[k])); } }; }) });
            }).catch(function (e) { if (!stop && e && e.code === "invalid_argument" && err) err(e); })
              .then(function () { if (!stop) t = setTimeout(tick, document.hidden ? 60000 : 15000); });
          };
          tick();
          document.addEventListener("visibilitychange", function () { if (!document.hidden && !stop) { clearTimeout(t); tick(); } });
          return function () { stop = true; clearTimeout(t); };
        }
      };
    }
  };
  var user = {
    me: me,
    id: function () { return me().then(function (u) { return u.id; }); },
    can: function () { return Promise.resolve(!!KEY); },
    isOwner: function () { return Promise.resolve(false); },
    profiles: function (ids) {
      var o = {};
      ids.forEach(function (i) { o[i] = { id: i, name: (lastDocs[i] && lastDocs[i].name) || (i === lsGet("ev:uid") ? lsGet("ev:name") || "" : ""), avatarUrl: "" }; });
      return Promise.resolve(o);
    }
  };
  // la demande de production est déjà enregistrée dans l'avis : Claude la prendra à sa prochaine vérification
  var mcp = { callTool: function (s, tool) { return tool === "fire_trigger" ? Promise.resolve({ payload: { queued: true } }) : Promise.reject({ code: "not_in_manifest" }); } };

  window.claude = { use: function (n) { return Promise.resolve(n === "db" ? (KEY ? db : null) : n === "user" ? user : n === "mcp" ? mcp : null); } };
})();
