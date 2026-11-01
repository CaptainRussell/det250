/* Storm HQ (Det 250): one saved class roster shared by the instructor tools.
   Type your class once in any instructor tool and the others can load it.
   Stored in this browser only (localStorage), never sent anywhere.
   Names are plain, one per entry: "Last, First" or just "Last". Each tool
   strips its own markers (for example a "*" or a team number) before saving. */
(function () {
  const KEY = "d250-class-roster-v1";
  function load() {
    try {
      const v = JSON.parse(localStorage.getItem(KEY));
      return Array.isArray(v) ? v.filter(n => typeof n === "string" && n.trim()).map(n => n.trim()) : [];
    } catch (e) { return []; }
  }
  function save(names) {
    const seen = new Set(), out = [];
    (names || []).forEach(n => {
      n = String(n || "").trim();
      if (n && !seen.has(n.toLowerCase())) { seen.add(n.toLowerCase()); out.push(n); }
    });
    try { localStorage.setItem(KEY, JSON.stringify(out)); } catch (e) {}
    return out;
  }
  /* Last name for tight spots: "Condon-Matzke, Isabella" -> "Condon-Matzke" */
  const last = n => String(n).split(",")[0].trim();

  /* The class or course name (for example "AFAS 3410"), shared the same way.
     Any <input data-d250-class> edits it; any [data-d250-class-show] element
     shows it (hidden while it is empty). */
  const NAME_KEY = "d250-class-name-v1";
  function name() { try { return (localStorage.getItem(NAME_KEY) || "").trim(); } catch (e) { return ""; } }
  function setName(v) {
    v = String(v || "").trim().slice(0, 40);
    try { v ? localStorage.setItem(NAME_KEY, v) : localStorage.removeItem(NAME_KEY); } catch (e) {}
    paint(); return v;
  }
  function paint() {
    const n = name();
    document.querySelectorAll("[data-d250-class-show]").forEach(el => {
      el.textContent = n;
      el.hidden = !n;
    });
    if (n && document.body && document.body.dataset.d250Title) document.title = n + " \u00b7 " + document.body.dataset.d250Title;
    else if (document.body && document.body.dataset.d250Title) document.title = document.body.dataset.d250Title;
  }
  function wire() {
    document.querySelectorAll("input[data-d250-class]").forEach(inp => {
      if (inp.dataset.wired) return; inp.dataset.wired = "1";
      inp.value = name();
      inp.addEventListener("input", () => setName(inp.value));
    });
    paint();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire); else wire();
  window.D250Class = { KEY, load, save, last, name, setName, wire };
})();
