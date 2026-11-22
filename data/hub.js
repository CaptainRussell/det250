/* Storm HQ (Det 250): the hub cards on the home page, in order. Plain JSON
   between the braces so the admin page can rewrite it.

   href     tool folder ("pfra/") or an outside https link
   name     card title          blurb   one or two sentences under the title
   section  "cadets", "instructors" or "admin" (Cadre only)
   tone     card color (hex)    icon    fallback icon key (ICONS in index.html)
   locked   optional pill text, for example "Cadre password" (true shows "Password")
   ext      true for an outside link (opens in a new tab); art names its card picture
   role     "cadre" shows the card only to someone signed in with the cadre password
   hidden   true hides the card without deleting it (use this for a tool nobody owns) */
window.D250_HUB = {
"tools": [
  {"href":"pfra/","name":"PFRA Calculator","tone":"#c8102e","icon":"calculator","section":"cadets","blurb":"Score a Physical Fitness Readiness Assessment against DAFMAN 36-2905 and the 2026 USAF scoring charts."},
  {"href":"whos-that-cadet/","name":"Know Your Wing","tone":"#1f4e9c","icon":"faces","section":"cadets","blurb":"Learn every face in the wing with flashcard drills, shadow mode and printable cards."},
  {"href":"org-chart/","name":"Det 250 Org Chart","tone":"#2f7d32","icon":"tree","section":"cadets","blurb":"The 250th Cadet Wing by semester: cadre, wing staff, flights, Flip Week and proposed charts."},
  {"href":"ribbon-rack/","name":"Ribbon Rack Builder","tone":"#4338ca","icon":"ribbons","section":"cadets","blurb":"Check the AFROTC ribbons you've earned and get your rack in order of precedence, with devices. Print it or share it."},
  {"href":"documents/","name":"Documents and Policy","tone":"#0369a1","icon":"book","section":"cadets","blurb":"The Storm Standard plus every AFI, DAFI, AFROTCI, notice and form the detachment uses, and the locked Fall 2026 plans and OPORDs."},
  {"href":"https://iowastate.sharepoint.com/:u:/r/sites/ISUAFROTC/SitePages/HomePage.aspx?d=web46a0478697483ba07db070fdb6b592&csf=1&web=2&share=IQBHoEbrl4Y7SKB9sHD9trWSAWYRIl7_IfMf5TGoI0MbHjk&e=qoKj8p","ext":true,"art":"sharepoint","name":"Cadet SharePoint","tone":"#036c70","icon":"book","section":"cadets","blurb":"Cadet access and forms: Wing Feedback, Warrior and Honor Points, Supply Room, Morale Shop, and the GMC and POC files."},
  {"href":"odt/","name":"ODT Tool","tone":"#155e75","icon":"faces","section":"cadets","locked":"Cadet password","blurb":"Find your room and van for each ODT, plus the itinerary and documents."},
  {"href":"evaluation/","name":"Evaluation Tools","tone":"#5d3f8c","icon":"chart","section":"cadets","blurb":"Peer Feedback, the Flight Staff Evaluation and the Cadre Dashboard with their results."},
  {"href":"spin-the-wheel/","name":"Spin the Wheel","tone":"#b45309","icon":"wheel","section":"instructors","blurb":"Seating chart and name wheel. Add your class, set up the room, and spin to call on a student."},
  {"href":"make-the-call/","name":"Make the Call","tone":"#0f766e","icon":"scale","section":"instructors","blurb":"Agree, Neutral or Disagree: teams argue leadership statements to a board and split the prize pool."},
  {"href":"battle-buddy-recon/","name":"Battle Buddy Recon","tone":"#4a5a36","icon":"binoculars","section":"instructors","blurb":"OPSEC practical exercise: pair cadets on a wheel, run the open-source recon clock, then brief out."},
  {"href":"practicum-adventure/","name":"Practicum Adventure","tone":"#6d28d9","icon":"dice","section":"instructors","blurb":"Leadership role-playing game for the projector. Cadets join on their phones, vote, roll and face the IG."},
  {"href":"admin-hub/","name":"Admin","tone":"#475569","icon":"shield","section":"admin","role":"cadre","blurb":"Everything behind the scenes in one place: Peer Feedback and Flight Staff Evaluation results, editing Storm HQ, site passwords and the back end."}
]
};
