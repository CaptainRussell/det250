/* Storm HQ (Det 250): the Org Chart's semesters, newest last. Plain JSON between the
   braces so the admin page (Org chart tab, Semesters) can rewrite it.

   current     id of the semester the Org Chart opens for old links (?view=flip, #<seat>)
   semesters   one card each on the Org Chart home page
     id        short id used in links (org-chart/?term=<id>)
     name      card title ("Fall 2026")
     blurb     optional line under the title (otherwise the chart names are listed)
     frozen    true once the semester is over: its charts read data/org-archive/<id>.js,
               a copy of the roster saved by the admin page's Freeze button
     charts    the buttons on that semester's chart bar, in order
       kind    "poc" (POC chart) or "flip" (Flip Week), both from the roster
               (or the frozen copy), or "proposal" (a proposed package in org-chart/proposals.js)
       proposal  for kind "proposal": the package id in proposals.js
       name    button text */
window.D250_CHARTS = {
"current": "fall-2026",
"semesters": [
  {"id":"fall-2026","name":"Fall 2026","blurb":"The 250th Cadet Wing POC chart and the Flip Week chart.","charts":[{"kind":"poc","name":"POC Chart"},{"kind":"flip","name":"Flip Week"}]},
  {"id":"spring-2027","name":"Spring 2027","blurb":"The three proposed wing command packages.","charts":[{"kind":"proposal","proposal":"kingery-helle","name":"Kingery/Helle"},{"kind":"proposal","proposal":"alt-bourek","name":"Alt/Bourek"},{"kind":"proposal","proposal":"salas-bienfang","name":"Salas/Bienfang"}]}
]
};
