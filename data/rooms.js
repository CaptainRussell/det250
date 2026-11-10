/* Storm HQ (Det 250): ODT room assignments, current and past. Plain JSON between the
   braces so the admin page (Rooms tab) can rewrite it.

   title   the tool name shown in the header
   events  one per ODT (or any trip with rooms): id (short, no spaces, used in links:
           odt-rooms/#<id>), name, place, start and end (YYYY-MM-DD), note (one line under
           the name), sections (room groups in the order they show, for example "Women")
   rooms   one per room: event (an event id), room (number or name on the card), sec (one of
           that event's sections), cadets (1 to 4 roster keys from data/roster.js; photos,
           ranks and positions come from the roster). One cadet = a bonus room.
   former  (added by the admin page) key -> [last, first, class] for cadets removed from the
           roster, so past assignments still show their names.
   The page opens on the next ODT that hasn't ended yet (or the latest one); the
   All assignments tab lists every event, upcoming and past. */
window.D250_ROOMS = {
"title": "ODT Room Assignments",
"events": [
  {"id":"offutt-2026-12","name":"Offutt Dec 3-4 ODT","place":"Offutt AFB, Nebraska","start":"2026-12-03","end":"2026-12-04","note":"Same Gender Mandatory.","sections":["Men · POC","Women","Men · GMC"]}
],
"rooms": [
  {"event":"offutt-2026-12","room":"1","sec":"Men · POC","cadets":["AlbertJosephI","AltTyceW"]},
  {"event":"offutt-2026-12","room":"2","sec":"Men · POC","cadets":["SalasAlfredoE","BarszczCadenN"]},
  {"event":"offutt-2026-12","room":"3","sec":"Men · POC","cadets":["BourekAkrynJ","CollierJonathanG"]},
  {"event":"offutt-2026-12","room":"4","sec":"Men · POC","cadets":["CooperTylerL","CurtisRobertT"]},
  {"event":"offutt-2026-12","room":"5","sec":"Men · POC","cadets":["DavilaJoaquinD","DavisMartiG"]},
  {"event":"offutt-2026-12","room":"6","sec":"Men · POC","cadets":["HaderAshtenM","HelleNicolasD"]},
  {"event":"offutt-2026-12","room":"7","sec":"Men · POC","cadets":["TuMicahJ","VanDevanderDonC"]},
  {"event":"offutt-2026-12","room":"8","sec":"Men · POC","cadets":["AshbackerMiloK"]},
  {"event":"offutt-2026-12","room":"9","sec":"Women","cadets":["JalodiaAnika","MarschangAllissaA"]},
  {"event":"offutt-2026-12","room":"10","sec":"Women","cadets":["FennelHarperR","HemauerJulia"]},
  {"event":"offutt-2026-12","room":"11","sec":"Women","cadets":["PeterJulia","CondonMatzkeIsabella"]},
  {"event":"offutt-2026-12","room":"12","sec":"Women","cadets":["ChandlerAmeliaM","GardnerLaceyI"]},
  {"event":"offutt-2026-12","room":"13","sec":"Women","cadets":["JohnsonZariahA","JohnsonZionJ"]},
  {"event":"offutt-2026-12","room":"14","sec":"Women","cadets":["PetersonMadelineM","PhanTaraT"]},
  {"event":"offutt-2026-12","room":"15","sec":"Men · GMC","cadets":["CallTysonD","UtterbackChristopherD"]},
  {"event":"offutt-2026-12","room":"16","sec":"Men · GMC","cadets":["BendingerMatthewS","BuddeCashJ"]},
  {"event":"offutt-2026-12","room":"17","sec":"Men · GMC","cadets":["JordanCooperS","KasparekCamdenL"]},
  {"event":"offutt-2026-12","room":"18","sec":"Men · GMC","cadets":["McNamaraZacharyA","RamseyKyleT"]},
  {"event":"offutt-2026-12","room":"19","sec":"Men · GMC","cadets":["SandersonWyattE","SchnuteIanW"]},
  {"event":"offutt-2026-12","room":"20","sec":"Men · GMC","cadets":["StatesEricD","TjadenAndrewJ"]},
  {"event":"offutt-2026-12","room":"21","sec":"Men · GMC","cadets":["UrbanowiczCharlesL","WheelerAndrewT"]},
  {"event":"offutt-2026-12","room":"22","sec":"Men · GMC","cadets":["MafnasMaxC","NelsenOliverU"]},
  {"event":"offutt-2026-12","room":"23","sec":"Men · GMC","cadets":["TheisJakeA","TidgewellCharlesA"]}
]
};
