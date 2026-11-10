/* Storm HQ (Det 250): preset cadet groups for the instructor tool rosters.
   Built in the browser from the shared roster, so load ../data/roster.js
   before this file. Change people in data/roster.js (or the admin page),
   never here. */
(function () {
  const R = window.D250_ROSTER || { people: {} };
  const GROUPS = [
    { id: "as100", label: "AS 100's", classes: ["AS100"] },
    { id: "as200", label: "AS 200's", classes: ["AS200"] },
    { id: "as250", label: "AS 250's", classes: ["AS250"] },
    { id: "as500", label: "AS 500's", classes: ["AS500"] },
    { id: "as300", label: "AS 300's", classes: ["AS300"] },
    { id: "as400", label: "AS 400's", classes: ["AS400"] },
    { id: "gb", label: "Graybeards", classes: ["Graybeard"] },
  ];
  const people = Object.entries(R.people).map(([key, [last, first, cls]]) => ({ key, last, first, cls }));
  const full = p => p.first ? `${p.last}, ${p.first}` : p.last;
  const inGroups = p => GROUPS.some(g => g.classes.includes(p.cls));
  window.D250Groups = GROUPS.map(g => ({
    id: g.id, label: g.label,
    names: people.filter(p => g.classes.includes(p.cls)).map(full).sort((a, b) => a.localeCompare(b)),
  }));
  /* "last, first" -> [photo key in org-chart/photos, AS class]; a missing photo falls back to initials */
  const cadets = {};
  people.filter(inGroups).forEach(p => { cadets[full(p).toLowerCase()] = [p.key, p.cls]; });
  window.D250Cadets = cadets;
})();
