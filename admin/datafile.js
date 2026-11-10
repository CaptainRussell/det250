/* Storm HQ admin: read and write the data/*.js files.
   Each data file is a comment header, then  window.<NAME> = { ...plain JSON... };
   D250DataFile.parse(text)  -> { head, name, data }
   D250DataFile.write(file, data) -> the same file text with new data, laid out one entry per
   line (arrays: one item per line; objects: one key per line) so changes read well in history. */
(function (root) {
  const RE = /window\.(D250_[A-Z0-9_]+)\s*=\s*/;
  function parse(text) {
    const m = RE.exec(text);
    if (!m) throw new Error("Not a Storm HQ data file");
    const w = {};
    new Function("window", text)(w);
    return { head: text.slice(0, m.index), name: m[1], data: w[m[1]] };
  }
  const j = v => JSON.stringify(v);
  function block(v) {
    if (Array.isArray(v)) return v.length ? "[\n" + v.map(x => "  " + j(x)).join(",\n") + "\n]" : "[]";
    if (v && typeof v === "object") {
      const e = Object.entries(v);
      return e.length ? "{\n" + e.map(([k, x]) => "  " + j(k) + ": " + j(x)).join(",\n") + "\n}" : "{}";
    }
    return j(v);
  }
  function write(file, data) {
    const body = Object.entries(data).map(([k, v]) => j(k) + ": " + block(v)).join(",\n");
    return file.head + "window." + file.name + " = {\n" + body + "\n};\n";
  }
  root.D250DataFile = { parse, write };
})(typeof window !== "undefined" ? window : globalThis);
