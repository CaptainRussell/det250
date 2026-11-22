/* Documents and Policy: the one unlock box for the protected plans and OPORDs.
   Used by documents/index.html and documents/opords/. The password is checked
   against restricted/vault.json in the browser and kept in sessionStorage
   d250-docs-pass (shared with the ODT Tool and the hub sign-in), so one unlock
   opens every protected file in this tab.

   D250DocVault.mount(el, {root, what, onChange(unlocked, animate)}) renders the box
   into el and resolves with the vault file list (or null if it didn't load).
   D250DocVault.nudge() scrolls to the box and makes it glow.
*/
(function(){
  const KEY = "d250-docs-pass";
  const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let V = null, box = null, onChange = () => {}, what = "Plans and OPORDs";
  const api = {unlocked:false, vault:null};

  async function check(pass){
    const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pass), "PBKDF2", false, ["deriveKey"]);
    const key = await crypto.subtle.deriveKey({name:"PBKDF2", salt:b64(V.salt), iterations:V.iter, hash:"SHA-256"}, base, {name:"AES-GCM", length:256}, false, ["decrypt"]);
    const c = b64(V.check);
    await crypto.subtle.decrypt({name:"AES-GCM", iv:c.subarray(0, 12)}, key, c.subarray(12));
  }
  const LOCK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path class="shackle" d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

  function set(on, animate){
    api.unlocked = on;
    box.classList.toggle("open", on);
    box.querySelector(".vt").textContent = what + (on ? " unlocked" : " are locked");
    onChange(on, animate);
  }
  api.nudge = function(){
    if(!box) return;
    box.scrollIntoView({block:"center", behavior: reduce ? "auto" : "smooth"});
    box.classList.remove("glow"); void box.offsetWidth; box.classList.add("glow");
    const pw = box.querySelector("input"); if(pw) setTimeout(() => pw.focus({preventScroll:true}), reduce ? 0 : 300);
  };
  api.mount = async function(el, opts){
    opts = opts || {};
    onChange = opts.onChange || onChange;
    what = opts.what || what;
    box = el;
    box.classList.add("vault");
    box.innerHTML = `<span class="vi">${LOCK}</span><span class="vt">${what} are locked</span>
      <form autocomplete="off"><label class="sr" for="vaultPw">Cadet password</label><input id="vaultPw" type="password" placeholder="Cadet password" required autocomplete="current-password"><button class="go" type="submit">Unlock</button></form>
      <button class="relock" type="button">Lock again</button>
      <p class="err" role="alert"></p>`;
    const form = box.querySelector("form"), pw = box.querySelector("input"), go = box.querySelector(".go"), err = box.querySelector(".err");
    form.addEventListener("submit", async e => {
      e.preventDefault(); if(!V) return;
      err.textContent = ""; go.disabled = true; go.textContent = "Checking…";
      try {
        await check(pw.value);
        try { sessionStorage.setItem(KEY, pw.value); } catch(_){}
        pw.value = ""; set(true, true);
      } catch(_){
        err.textContent = "That password didn't work.";
        box.classList.remove("shake", "glow"); void box.offsetWidth; box.classList.add("shake"); pw.select();
      } finally { go.disabled = false; go.textContent = "Unlock"; }
    });
    box.querySelector(".relock").addEventListener("click", () => { try { sessionStorage.removeItem(KEY); } catch(_){} set(false, false); });
    try {
      V = await fetch((opts.root || "") + "restricted/vault.json").then(r => { if(!r.ok) throw 0; return r.json(); });
    } catch(_){ return null; }
    api.vault = V;
    let saved = null; try { saved = sessionStorage.getItem(KEY); } catch(_){}
    if(saved){ try { await check(saved); set(true, false); } catch(_){ try { sessionStorage.removeItem(KEY); } catch(__){} } }
    return V;
  };
  window.D250DocVault = api;
})();
