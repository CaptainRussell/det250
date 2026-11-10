/* Storm HQ (Det 250): the hub cards on the home page, in order. Plain JSON
   between the braces so the admin page can rewrite it.

   href     tool folder ("pfra/") or an outside https link
   name     card title          blurb   one or two sentences under the title
   section  "cadets", "evaluators" or "instructors"
   tone     card color (hex)    icon    fallback icon key (ICONS in index.html)
   locked   optional pill text, for example "Cadre password" (true shows "Password")
   ext      true for an outside link (opens in a new tab); art names its card picture
   hidden   true hides the card without deleting it (use this for a tool nobody owns) */
window.D250_HUB = {
"tools": [
  {"href":"pfra/","name":"PFRA Calculator","tone":"#c8102e","icon":"calculator","section":"cadets","blurb":"Score a Physical Fitness Readiness Assessment against DAFMAN 36-2905 and the 2026 USAF scoring charts."},
  {"href":"whos-that-cadet/","name":"Know Your Wing","tone":"#1f4e9c","icon":"faces","section":"cadets","blurb":"Learn every face in the wing with flashcard drills, shadow mode and printable cards."},
  {"href":"org-chart/","name":"Det 250 Org Chart","tone":"#2f7d32","icon":"tree","section":"cadets","blurb":"Fall 2026 250th Cadet Wing: cadre, wing staff, flights and the Flip Week view."},
  {"href":"ribbon-rack/","name":"Ribbon Rack Builder","tone":"#4338ca","icon":"ribbons","section":"cadets","blurb":"Check the AFROTC ribbons you've earned and get your rack in order of precedence, with devices. Print it or share it."},
  {"href":"documents/","name":"Documents and Policy","tone":"#0369a1","icon":"book","section":"cadets","blurb":"The Storm Standard plus every AFI, DAFI, AFROTCI, notice and form the detachment uses, and the locked Fall 2026 plans and OPORDs."},
  {"href":"https://iowastate.sharepoint.com/:u:/r/sites/ISUAFROTC/SitePages/HomePage.aspx?d=web46a0478697483ba07db070fdb6b592&csf=1&web=2&share=IQBHoEbrl4Y7SKB9sHD9trWSAWYRIl7_IfMf5TGoI0MbHjk&e=qoKj8p","ext":true,"art":"sharepoint","name":"Cadet SharePoint","tone":"#036c70","icon":"book","section":"cadets","blurb":"Cadet access and forms: Wing Feedback, Warrior and Honor Points, Supply Room, Morale Shop, and the GMC and POC files."},
  {"href":"odt/","name":"ODT Module","tone":"#155e75","icon":"faces","section":"cadets","locked":"Cadet password","blurb":"Everything for each ODT: dates, itinerary, who's going, rooms, lodging and meals, current and past."},
  {"href":"flight-staff-eval/","name":"Flight Staff Evaluation","tone":"#a06f00","icon":"chart","section":"evaluators","locked":"Flight Staff password","blurb":"Rate and stratify GMC cadets by flight. Results go straight to cadre."},
  {"href":"peer-feedback/","name":"Peer Feedback","tone":"#be185d","icon":"peers","section":"evaluators","blurb":"Rate every cadet in your peer group 1 to 5 in Leadership, Professionalism, Teamwork and Communication. Due Fri 20 Nov, 1700. Only cadre see the results."},
  {"href":"cadre/","name":"Cadre Dashboard","tone":"#475569","icon":"shield","section":"evaluators","locked":"Cadre password","blurb":"Peer Feedback and Flight Staff Evaluation results: rankings by AS level, charts and who still owes theirs."},
  {"href":"spin-the-wheel/","name":"Spin the Wheel","tone":"#b45309","icon":"wheel","section":"instructors","blurb":"Seating chart and name wheel. Add your class, set up the room, and spin to call on a student."},
  {"href":"make-the-call/","name":"Make the Call","tone":"#0f766e","icon":"scale","section":"instructors","blurb":"Agree, Neutral or Disagree: teams argue leadership statements to a board and split the prize pool."},
  {"href":"battle-buddy-recon/","name":"Battle Buddy Recon","tone":"#4a5a36","icon":"binoculars","section":"instructors","blurb":"OPSEC practical exercise: pair cadets on a wheel, run the open-source recon clock, then brief out."},
  {"href":"practicum-adventure/","name":"Practicum Adventure","tone":"#6d28d9","icon":"dice","section":"instructors","blurb":"Leadership role-playing game for the projector. Cadets join on their phones, vote, roll and face the IG."}
]
};
