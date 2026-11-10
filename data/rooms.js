/* Storm HQ (Det 250): ODT room assignments. Plain JSON between the braces so the
   admin page (Rooms tab) can rewrite it.

   title     page title            note   one line under the title (dates, place, rules)
   sections  room groups, in the order they show (for example "Women", "Men · POC")
   rooms     one per room: room (the room number or name shown on the card), sec (one of
             sections), cadets (1 to 4 roster keys from data/roster.js; photos, ranks and
             positions come from the roster). A room with one cadet shows as a bonus room. */
window.D250_ROOMS = {
"title": "Offutt Dec 3-4 ODT",
"note": "Same Gender Mandatory.",
"sections": [
  "Men · POC",
  "Women",
  "Men · GMC"
],
"rooms": [
  {"room":"1","sec":"Men · POC","cadets":["AlbertJosephI","AltTyceW"]},
  {"room":"2","sec":"Men · POC","cadets":["SalasAlfredoE","BarszczCadenN"]},
  {"room":"3","sec":"Men · POC","cadets":["BourekAkrynJ","CollierJonathanG"]},
  {"room":"4","sec":"Men · POC","cadets":["CooperTylerL","CurtisRobertT"]},
  {"room":"5","sec":"Men · POC","cadets":["DavilaJoaquinD","DavisMartiG"]},
  {"room":"6","sec":"Men · POC","cadets":["HaderAshtenM","HelleNicolasD"]},
  {"room":"7","sec":"Men · POC","cadets":["TuMicahJ","VanDevanderDonC"]},
  {"room":"8","sec":"Men · POC","cadets":["AshbackerMiloK"]},
  {"room":"9","sec":"Women","cadets":["JalodiaAnika","MarschangAllissaA"]},
  {"room":"10","sec":"Women","cadets":["FennelHarperR","HemauerJulia"]},
  {"room":"11","sec":"Women","cadets":["PeterJulia","CondonMatzkeIsabella"]},
  {"room":"12","sec":"Women","cadets":["ChandlerAmeliaM","GardnerLaceyI"]},
  {"room":"13","sec":"Women","cadets":["JohnsonZariahA","JohnsonZionJ"]},
  {"room":"14","sec":"Women","cadets":["PetersonMadelineM","PhanTaraT"]},
  {"room":"15","sec":"Men · GMC","cadets":["CallTysonD","UtterbackChristopherD"]},
  {"room":"16","sec":"Men · GMC","cadets":["BendingerMatthewS","BuddeCashJ"]},
  {"room":"17","sec":"Men · GMC","cadets":["JordanCooperS","KasparekCamdenL"]},
  {"room":"18","sec":"Men · GMC","cadets":["McNamaraZacharyA","RamseyKyleT"]},
  {"room":"19","sec":"Men · GMC","cadets":["SandersonWyattE","SchnuteIanW"]},
  {"room":"20","sec":"Men · GMC","cadets":["StatesEricD","TjadenAndrewJ"]},
  {"room":"21","sec":"Men · GMC","cadets":["UrbanowiczCharlesL","WheelerAndrewT"]},
  {"room":"22","sec":"Men · GMC","cadets":["MafnasMaxC","NelsenOliverU"]},
  {"room":"23","sec":"Men · GMC","cadets":["TheisJakeA","TidgewellCharlesA"]}
]
};
