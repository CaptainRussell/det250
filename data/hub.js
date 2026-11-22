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
  {"href":"pfra/","name":"PFRA Calculator","tone":"#c8102e","icon":"calculator","section":"cadets","blurb":"Score a PFRA against the 2026 USAF charts."},
  {"href":"ribbon-rack/","name":"Ribbon Rack Builder","tone":"#4338ca","icon":"ribbons","section":"cadets","blurb":"Build your ribbon rack in order."},
  {"href":"org-chart/","name":"250th Cadet Wing","tone":"#2f7d32","icon":"tree","section":"cadets","blurb":"Org charts by semester, and every face."},
  {"href":"documents/","name":"Documents and Policy","tone":"#0369a1","icon":"book","section":"cadets","blurb":"The Storm Standard, regs, forms and OPORDs."},
  {"href":"https://iowastate.sharepoint.com/:u:/r/sites/ISUAFROTC/SitePages/HomePage.aspx?d=web46a0478697483ba07db070fdb6b592&csf=1&web=2&share=IQBHoEbrl4Y7SKB9sHD9trWSAWYRIl7_IfMf5TGoI0MbHjk&e=qoKj8p","ext":true,"art":"sharepoint","name":"Cadet SharePoint","tone":"#036c70","icon":"book","section":"cadets","blurb":"Wing Feedback, points, supply and files."},
  {"href":"odt/","name":"ODT Tool","tone":"#155e75","icon":"faces","section":"cadets","locked":"Cadet password","blurb":"Your room, your van and the itinerary."},
  {"href":"whos-that-cadet/","hidden":true,"name":"Know Your Wing","tone":"#1f4e9c","icon":"faces","section":"cadets","blurb":"Learn every face in the wing. Opened from the Org Chart page, not the hub."},
  {"href":"evaluation/","name":"Evaluation Tools","tone":"#5d3f8c","icon":"chart","section":"cadets","blurb":"Peer Feedback, Flight Staff Eval, results."},
  {"href":"spin-the-wheel/","name":"Spin the Wheel","tone":"#b45309","icon":"wheel","section":"instructors","blurb":"Seating chart and a name wheel for class."},
  {"href":"activities/","name":"Class Activities","tone":"#0e7490","icon":"dice","section":"instructors","blurb":"Make the Call, Battle Buddy Recon, Practicum."},
  {"href":"make-the-call/","hidden":true,"name":"Make the Call","tone":"#0f766e","icon":"scale","section":"instructors","blurb":"Teams debate leadership statements. Opened from Class Activities, not the hub."},
  {"href":"battle-buddy-recon/","hidden":true,"name":"Battle Buddy Recon","tone":"#4a5a36","icon":"binoculars","section":"instructors","blurb":"OPSEC recon exercise in pairs. Opened from Class Activities, not the hub."},
  {"href":"practicum-adventure/","hidden":true,"name":"Practicum Adventure","tone":"#6d28d9","icon":"dice","section":"instructors","blurb":"Leadership RPG played on cadets' phones. Opened from Class Activities, not the hub."},
  {"href":"admin-hub/","name":"Admin","tone":"#475569","icon":"shield","section":"admin","role":"cadre","blurb":"How to change Storm HQ, step by step."}
]
};
