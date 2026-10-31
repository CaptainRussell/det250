// Rebuild shared/cadet-groups.js from the PEOPLE table in org-chart/index.html.
// Run from the repo root after the org chart changes:  node tools/build-cadet-groups.mjs
import { readFileSync, writeFileSync } from "node:fs";

const html = readFileSync("org-chart/index.html", "utf8");
const block = html.match(/const PEOPLE = \{([\s\S]*?)\n\};/);
if (!block) throw new Error("PEOPLE not found in org-chart/index.html");
const people = [...block[1].matchAll(/\w+:\["([^"]*)","([^"]*)","([^"]*)"\]/g)].map(m => ({ last: m[1], first: m[2], cls: m[3] }));

const GROUPS = [
  { id: "as100", label: "AS 100's", classes: ["AS100"] },
  { id: "as200", label: "AS 200/250/500's", classes: ["AS200", "AS250", "AS500"] },
  { id: "as300", label: "AS 300's", classes: ["AS300"] },
  { id: "as400", label: "AS 400's", classes: ["AS400"] },
  { id: "gb", label: "Graybeards", classes: ["Graybeard"] },
];
const byName = (a, b) => a.localeCompare(b);
const out = GROUPS.map(g => ({
  id: g.id, label: g.label,
  names: people.filter(p => g.classes.includes(p.cls)).map(p => p.first ? `${p.last}, ${p.first}` : p.last).sort(byName),
}));

const js = `/* Det 250 Cadet Hub: preset cadet groups for the instructor tool rosters.
   GENERATED from the PEOPLE table in org-chart/index.html by
   tools/build-cadet-groups.mjs. Do not edit by hand: change the org chart,
   then run  node tools/build-cadet-groups.mjs  from the repo root. */
window.D250Groups = ${JSON.stringify(out, null, 1).replace(/\n\s*"/g, ' "').replace(/\n\s*\]/g, " ]").replace(/\n\s*\}/g, " }")};
`;
writeFileSync("shared/cadet-groups.js", js);
console.log(out.map(g => `${g.label}: ${g.names.length}`).join("\n"));
