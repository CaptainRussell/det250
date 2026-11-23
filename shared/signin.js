/* Storm HQ sign-in (Nov 2026, Captain Russell): one box on the hub takes the cadet
   password or the cadre password, or the reader skips it.

   No password is written in this file. A password is checked by opening a file it
   already locks:
     cadet  documents/restricted/vault.json (its "check" field), the Documents and Policy
            and ODT Tool password
     cadre  admin/vault.json, the admin password (the Cadre Dashboard uses the same one)
   On success the password is put in the sessionStorage keys the locked tools already
   read, so they open without asking again in this browser tab:
     cadet  d250-docs-pass (Documents and Policy, ODT Tool)
     cadre  d250-admin-pass, d250-cadre-pass (Cadre Admin, Cadre Dashboard), plus the
            Site passwords saved in the admin vault: locks.docs -> d250-docs-pass and
            locks.fse -> d250-gmc-pass (Flight Staff Evaluation). Save those once on
            Cadre Admin, History and settings, Site passwords ("Enter it once").
   d250-role (sessionStorage) holds "cadet", "cadre" or "skip". "Keep me signed in on
   this device" also keeps the password in localStorage d250-signin-v1, and the hub
   signs in from it when a new tab opens.

   D250SignIn.docsPass(pw) turns the admin password into the cadet password, and
   D250SignIn.fsePass(pw) turns it into the Flight Staff password, for the pages that
   ask for their own password.

   D250SignIn.adopt(pw) (Captain Russell, 23 Nov 2026): every locked page calls it after
   a password opens it, so a reader who skipped the hub sign-in is signed in at that
   password's level from then on: the cadet password signs in as cadet, the cadre (=
   admin) password as cadre. It only ever moves up (skip -> cadet -> cadre), never
   down, and keeps the keys already in the tab. The Flight Staff password is its own
   (evaluators only), so it opens that page but signs no one in. D250SignIn.sync() is
   the hub's fallback for a tab that holds a tool's key without a role.

   Usage: <script src="<root>shared/signin.js"></script>, then D250SignIn.root = "../"
   on pages below the root (the hub leaves it ""). */
(function(){
  const KEYS = {role:"d250-role", docs:"d250-docs-pass", cadre:"d250-cadre-pass", admin:"d250-admin-pass", fse:"d250-gmc-pass", keep:"d250-signin-v1"};
  const ss = {get:k => { try{ return sessionStorage.getItem(k) || ""; }catch(_){ return ""; } },
              set:(k, v) => { try{ sessionStorage.setItem(k, v); }catch(_){} },
              del:k => { try{ sessionStorage.removeItem(k); }catch(_){} }};
  const ls = {get:k => { try{ return localStorage.getItem(k) || ""; }catch(_){ return ""; } },
              set:(k, v) => { try{ localStorage.setItem(k, v); }catch(_){} },
              del:k => { try{ localStorage.removeItem(k); }catch(_){} }};
  const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  async function key(pw, salt, iter){
    const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey({name:"PBKDF2", salt:b64(salt), iterations:iter || 310000, hash:"SHA-256"}, base, {name:"AES-GCM", length:256}, false, ["decrypt"]);
  }
  const cache = {};
  async function file(path){
    if (!(path in cache)) cache[path] = fetch(api.root + path, {cache:"no-store"}).then(r => r.ok ? r.json() : null).catch(() => null);
    return cache[path];
  }
  async function asCadet(pw){
    const V = await file("documents/restricted/vault.json"); if (!V || !V.check) return false;
    try{ const c = b64(V.check); await crypto.subtle.decrypt({name:"AES-GCM", iv:c.subarray(0, 12)}, await key(pw, V.salt, V.iter), c.subarray(12)); return true; }
    catch(_){ return false; }
  }
  async function asCadre(pw){   // returns the saved Site passwords, or null
    const V = await file("admin/vault.json"); if (!V || !V.data) return null;
    try{
      const plain = await crypto.subtle.decrypt({name:"AES-GCM", iv:b64(V.iv)}, await key(pw, V.salt, V.iter), b64(V.data));
      const locks = (JSON.parse(new TextDecoder().decode(plain)).locks) || {};
      return {docs:locks.docs || "", fse:locks.fse || ""};   // keep only the passwords; the GitHub key is dropped here
    }catch(_){ return null; }
  }
  const api = {
    root:"",
    KEYS,
    role(){ return ss.get(KEYS.role); },
    has(name){ return !!ss.get(KEYS[name]); },
    kept(){ return !!ls.get(KEYS.keep); },
    // Checks a password. Resolves to "cadet" or "cadre" and stores it; rejects when neither opens.
    async signIn(pw, keep){
      pw = String(pw || "");
      if (!pw) throw new Error("Enter a password.");
      const [cadre, cadet] = await Promise.all([asCadre(pw), asCadet(pw)]);
      if (cadre){
        api.clear(true);
        ss.set(KEYS.admin, pw); ss.set(KEYS.cadre, pw);
        if (cadre.docs) ss.set(KEYS.docs, cadre.docs);
        if (cadre.fse) ss.set(KEYS.fse, cadre.fse);
        ss.set(KEYS.role, "cadre");
      } else if (cadet){
        api.clear(true);
        ss.set(KEYS.docs, pw); ss.set(KEYS.role, "cadet");
      } else throw new Error("That password didn't work. Try again.");
      if (keep) ls.set(KEYS.keep, pw); else ls.del(KEYS.keep);
      return api.role();
    },
    // The cadet password a typed password stands for: itself when it opens the cadet vault,
    // or, for the admin password, the Documents password saved in the admin vault
    // (locks.docs). Resolves "" when neither works. Used by the Documents and Policy
    // unlock box, the document viewer and the ODT Tool (Captain Russell, 22 Nov 2026:
    // the admin password opens documents too).
    async docsPass(pw){
      pw = String(pw || ""); if (!pw) return "";
      if (await asCadet(pw)) return pw;
      const c = await asCadre(pw);
      return c && c.docs ? c.docs : "";
    },
    // The Flight Staff password the admin password stands for (locks.fse in the admin
    // vault), or "" (Captain Russell, 23 Nov 2026: the cadre password opens everything).
    async fsePass(pw){
      pw = String(pw || ""); if (!pw) return "";
      const c = await asCadre(pw);
      return c && c.fse ? c.fse : "";
    },
    // Whether a password opens the admin vault (the cadre password).
    async isCadre(pw){ return !!(await asCadre(String(pw || ""))); },
    // Signs this tab in at the level of a password that just opened a locked page.
    // Moves only up, never down; adds keys, never clears them. Resolves to the role.
    async adopt(pw){
      pw = String(pw || "");
      const now = api.role();
      if (!pw || now === "cadre") return now;
      const cadre = await asCadre(pw);
      if (cadre){
        ss.set(KEYS.admin, pw); ss.set(KEYS.cadre, pw);
        if (cadre.docs) ss.set(KEYS.docs, cadre.docs);
        if (cadre.fse) ss.set(KEYS.fse, cadre.fse);
        ss.set(KEYS.role, "cadre");
        return "cadre";
      }
      if (now === "cadet") return now;
      if (await asCadet(pw)){ ss.set(KEYS.docs, pw); ss.set(KEYS.role, "cadet"); return "cadet"; }
      return now;
    },
    // Hub fallback: a tab holding a tool's key but no role (or "skip") is signed in at that
    // key's level. The keys are only saved after they opened their page.
    async sync(){
      const now = api.role();
      if (now === "cadre") return now;
      const pw = ss.get(KEYS.admin) || ss.get(KEYS.cadre);
      if (pw && await asCadre(pw)) return api.adopt(pw);
      if (now !== "cadet" && ss.get(KEYS.docs)) return api.adopt(ss.get(KEYS.docs));
      return now;
    },
    skip(){ ss.set(KEYS.role, "skip"); },
    // Signs in from "Keep me signed in" when this tab has not chosen yet. Resolves to the role or "".
    async resume(){
      if (api.role()) return api.role();
      const pw = ls.get(KEYS.keep); if (!pw) return "";
      try{ return await api.signIn(pw, true); }catch(_){ ls.del(KEYS.keep); return ""; }
    },
    clear(keepDevice){
      ["role", "docs", "cadre", "admin", "fse"].forEach(k => ss.del(KEYS[k]));
      if (!keepDevice) ls.del(KEYS.keep);
    }
  };
  window.D250SignIn = api;
})();
