/* Det 250 Cadet Hub: the common screen pieces for the instructor tools.
   Load after class-roster.js and cadet-groups.js.

   Every instructor tool uses the same flow:
     - numbered step tabs in the tool header (D250Steps), step 1 is always "Roster"
     - the same roster panel on step 1 (D250Roster): preset cadet groups you tick
       on and off, a paste box, Load saved class, Clear, Save roster
     - a "Next" button at the bottom right of each step

   D250Steps.mount({ steps: ["roster", "class"], initial, beforeLeave(from, to), onShow(step) })
     Tabs:  <nav class="d250-steps"><button data-step="roster">...</button></nav>
     Views: <section class="d250-step" data-step-view="roster">...</section>
     Next:  any element with data-step-go="class"
     The open step is kept in the URL hash.

   D250Roster.mount(host, { text, apply, hint, placeholder, onInput })
     text():      the roster text the tool is using now (to fill the box)
     apply(text): the tool parses and uses it; return a message string, or
                  { error: "..." } to refuse. The plain names are also saved as
                  the shared class roster for the other tools.
     Returns { value(), set(text), fill(text), dirty(), save(), refresh() }.
     set() marks the text as saved; fill() changes the box like typing would. */
(function () {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  /* A roster line without the tool's markers: a trailing "*" (distance learning)
     or a trailing ", 2" (team number). */
  const base = line => String(line).trim().replace(/\*+\s*$/, "").replace(/[,\t]\s*\d+\s*$/, "").trim();
  const key = line => base(line).toLowerCase();
  const lines = text => String(text || "").split(/\r?\n/).map(s => s.trim()).filter(Boolean);

  /* ------------------------------------------------------------ steps */
  function mountSteps(opts) {
    const steps = opts.steps;
    let cur = null;
    function show(step, quiet) {
      if (!steps.includes(step)) step = steps[0];
      cur = step;
      document.querySelectorAll("[data-step-view]").forEach(v => { v.hidden = v.dataset.stepView !== step; });
      document.querySelectorAll(".d250-steps [data-step]").forEach(b => {
        if (b.dataset.step === step) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
      });
      try { history.replaceState(null, "", "#" + step); } catch (e) {}
      if (opts.onShow) opts.onShow(step);
      if (!quiet) window.scrollTo(0, 0);
    }
    document.addEventListener("click", e => {
      const b = e.target.closest(".d250-steps [data-step], [data-step-go]");
      if (!b) return;
      const to = b.dataset.step || b.dataset.stepGo;
      if (opts.beforeLeave && opts.beforeLeave(cur, to) === false) return;
      show(to);
    });
    show((location.hash || "").slice(1) || opts.initial, true);
    return { show, current: () => cur };
  }

  /* ----------------------------------------------------------- roster */
  function mountRoster(host, opts) {
    const groups = Array.isArray(window.D250Groups) ? window.D250Groups : [];
    host.classList.add("panel", "d250-roster");
    host.innerHTML = `
      <div class="panel-hd"><span class="label">Roster <span class="r-count"></span></span><span class="r-state hint"></span></div>
      <div class="panel-bd">
        ${groups.length ? `<div class="r-presets-hd"><span class="label">Add from the org chart</span><span class="hint">Tick a class on or off</span></div>
        <div class="r-presets" role="group" aria-label="Preset cadet groups">${groups.map(g =>
          `<button type="button" class="r-preset" data-group="${esc(g.id)}" aria-pressed="false"><span class="r-box" aria-hidden="true"></span>${esc(g.label)}<span class="r-n">${g.names.length}</span></button>`).join("")}</div>` : ""}
        <label class="label r-paste" for="${host.id || "d250"}-roster-text">Names, one per line</label>
        <textarea id="${host.id || "d250"}-roster-text" class="r-text" spellcheck="false" placeholder="${esc(opts.placeholder || "Last, First\nLast, First")}"></textarea>
        ${opts.hint ? `<p class="hint">${opts.hint}</p>` : ""}
        <div class="roster-tools">
          <button type="button" class="btn primary r-save">Save roster</button>
          <button type="button" class="btn quiet r-load">Load saved class</button>
          <button type="button" class="btn quiet r-clear">Clear</button>
        </div>
        <p class="hint r-msg" aria-live="polite"></p>
      </div>`;
    const ta = host.querySelector(".r-text"), msg = host.querySelector(".r-msg");
    let applied = "";
    const value = () => ta.value;
    const norm = t => lines(t).join("\n");
    const dirty = () => norm(ta.value) !== norm(applied);

    function paint() {
      const have = new Set(lines(ta.value).map(key));
      host.querySelector(".r-count").textContent = have.size ? "· " + have.size : "";
      host.querySelector(".r-state").textContent = dirty() ? "Not saved yet" : "";
      host.querySelectorAll(".r-preset").forEach(b => {
        const g = groups.find(x => x.id === b.dataset.group), n = g.names.filter(nm => have.has(nm.toLowerCase())).length;
        b.setAttribute("aria-pressed", n === 0 ? "false" : n === g.names.length ? "true" : "mixed");
        b.title = n && n < g.names.length ? n + " of " + g.names.length + " on the roster" : "";
      });
    }
    function changed() { msg.textContent = ""; paint(); if (opts.onInput) opts.onInput(ta.value); }
    function set(text) { ta.value = text; applied = text; paint(); }

    host.querySelectorAll(".r-preset").forEach(b => b.addEventListener("click", () => {
      const g = groups.find(x => x.id === b.dataset.group), names = new Set(g.names.map(n => n.toLowerCase()));
      const cur = lines(ta.value);
      if (b.getAttribute("aria-pressed") === "true") {
        ta.value = cur.filter(l => !names.has(key(l))).join("\n");
      } else {
        const have = new Set(cur.map(key));
        ta.value = cur.concat(g.names.filter(n => !have.has(n.toLowerCase()))).join("\n");
      }
      changed();
    }));
    ta.addEventListener("input", changed);
    host.querySelector(".r-load").addEventListener("click", () => {
      const names = window.D250Class ? D250Class.load() : [];
      if (!names.length) { msg.textContent = "No saved class yet. Tick a group or type your names, then Save roster."; return; }
      ta.value = names.join("\n"); changed();
      msg.textContent = "Loaded " + names.length + " names. Save roster to use them.";
    });
    host.querySelector(".r-clear").addEventListener("click", () => { ta.value = ""; changed(); ta.focus(); });

    function save() {
      const res = opts.apply(ta.value);
      if (res && res.error) { msg.textContent = res.error; return false; }
      applied = ta.value;
      if (window.D250Class) D250Class.save(lines(ta.value).map(base));
      paint();
      msg.textContent = res || "Roster saved.";
      return true;
    }
    host.querySelector(".r-save").addEventListener("click", save);

    set(opts.text ? opts.text() : "");
    return { value, set, dirty, save, fill: t => { ta.value = t; changed(); }, refresh: () => set(opts.text ? opts.text() : "") };
  }

  /* ------------------------------------------------------------ faces
     Org Chart style photo: round, ringed in the cadet's AS class color.
     Names on the org chart ("Last, First", markers ignored) get their photo
     from ../org-chart/photos; anyone else gets their initials.
     D250Face.html(name, size) -> markup; D250Face.find(name) -> { key, cls } or null. */
  const RING = { AS100: "r100", AS200: "r200", AS250: "r250", AS300: "r300", AS400: "r400", AS500: "r500", Graybeard: "rgb" };
  function find(name) {
    const m = (window.D250Cadets || {})[base(name).toLowerCase()];
    return m ? { key: m[0], cls: m[1] } : null;
  }
  function initials(name) {
    const [l = "", f = ""] = base(name).split(",").map(x => x.trim());
    return ((f[0] || "") + (l[0] || "")).toUpperCase() || "?";
  }
  function faceHTML(name, size) {
    const c = find(name);
    return `<span class="d250-face ${c ? RING[c.cls] || "" : ""}" style="--sz:${size || 32}px" aria-hidden="true"><b>${esc(initials(name))}</b>${
      c && c.key ? `<img draggable="false" src="../org-chart/photos/${esc(c.key)}.jpg" alt="" loading="lazy" decoding="async" onerror="this.remove()">` : ""}</span>`;
  }

  /* Photos are never dragged on their own: grabbing a seat or chip by its photo
     drags the seat or chip (the tools' own drag and drop), not the picture. */
  document.addEventListener("dragstart", e => {
    if (e.target && e.target.closest && e.target.closest(".d250-face")) e.preventDefault();
  });

  window.D250Steps = { mount: mountSteps };
  window.D250Face = { html: faceHTML, find };
  window.D250Roster = { mount: mountRoster, base, lines };
})();
