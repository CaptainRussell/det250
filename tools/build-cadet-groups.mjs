// Rebuild shared/cadet-groups.js from the PEOPLE table in org-chart/index.html.
// Run from the repo root after the org chart changes:  node tools/build-cadet-groups.mjs
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const html = readFileSync("org-chart/index.html", "utf8");
const block = html.match(/const PEOPLE = \{([\s\S]*?)\n\};/);
if (!block) throw new Error("PEOPLE not found in org-chart/index.html");
const people = [...block[1].matchAll(/(\w+):\["([^"]*)","([^"]*)","([^"]*)"\]/g)].map(m => ({ key: m[1], last: m[2], first: m[3], cls: m[4] }));

const GROUPS = [
  { id: "as100", label: "AS 100's", classes: ["AS100"] },
  { id: "as200", label: "AS 200's", classes: ["AS200"] },
  { id: "as250", label: "AS 250's", classes: ["AS250"] },
  { id: "as500", label: "AS 500's", classes: ["AS500"] },
  { id: "as300", label: "AS 300's", classes: ["AS300"] },
  { id: "as400", label: "AS 400's", classes: ["AS400"] },
  { id: "gb", label: "Graybeards", classes: ["Graybeard"] },
];
const byName = (a, b) => a.localeCompare(b);
const out = GROUPS.map(g => ({
  id: g.id, label: g.label,
  names: people.filter(p => g.classes.includes(p.cls)).map(p => p.first ? `${p.last}, ${p.first}` : p.last).sort(byName),
}));

const full = p => p.first ? `${p.last}, ${p.first}` : p.last;
// Photo lookup for every cadet in the groups: "last, first" -> [org chart photo key, class]
const cadets = {};
people.filter(p => GROUPS.some(g => g.classes.includes(p.cls))).forEach(p => {
  cadets[full(p).toLowerCase()] = [existsSync(`org-chart/photos/${p.key}.jpg`) ? p.key : "", p.cls];
});

const js = `/* Storm HQ (Det 250): preset cadet groups for the instructor tool rosters.
   GENERATED from the PEOPLE table in org-chart/index.html by
   tools/build-cadet-groups.mjs. Do not edit by hand: change the org chart,
   then run  node tools/build-cadet-groups.mjs  from the repo root. */
window.D250Groups = ${JSON.stringify(out, null, 1).replace(/\n\s*"/g, ' "').replace(/\n\s*\]/g, " ]").replace(/\n\s*\}/g, " }")};
/* "last, first" -> [photo key in org-chart/photos (empty if none), AS class] */
window.D250Cadets = ${JSON.stringify(cadets).replace(/\],"/g, '],\n "')};
`;
writeFileSync("shared/cadet-groups.js", js);
console.log(out.map(g => `${g.label}: ${g.names.length}`).join("\n"));
