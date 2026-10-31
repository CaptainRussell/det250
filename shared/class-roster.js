/* Det 250 Cadet Hub: one saved class roster shared by the instructor tools.
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
  window.D250Class = { KEY, load, save, last };
})();
