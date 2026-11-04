/* Storm HQ (Det 250): Peer Feedback back end (Google Apps Script web app).

   This file is the logic only. tools/build-peer-feedback.mjs puts the roster,
   the personal codes and the cadre read token in front of it and writes the
   finished script OUTSIDE the repo (the codes and token are private).

   Set up (one time):
     1. Make a new Google Sheet (it only holds Peer Feedback).
     2. Extensions > Apps Script, delete what is there, paste PeerFeedback.gs.
     3. Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
     4. Send the /exec URL to the Storm HQ thread so it can be set in the page.
   After a roster change: paste the new PeerFeedback.gs, then Deploy > Manage
   deployments > Edit > Version: New version (the URL stays the same).

   Endpoints
     GET  ?action=whoami&code=XXXX-XXXX   -> who the code belongs to + the peers to rate
     GET  ?action=results&token=...      -> everything the Cadre page needs
     POST {action:"peer", code, ratings:{peerKey:[lead,prof,team,comm]}}
   Tabs it keeps: Ratings (one row per rater and peer). ONE submission per cadet: to let a cadet redo it, delete their rows in Submissions and Ratings,
   Submissions (one row per cadet), Log (every accepted submit). */

var CATS = ['lead', 'prof', 'team', 'comm'];
var CAT_LABELS = ['Leadership', 'Professionalism', 'Teamwork', 'Communication'];
var GROUP_LABELS = { poc: 'POC', gmc: 'AS 200 / 250 / 500', as100: 'AS 100' };

function norm_(code) { return String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
function byCode_(code) {
  var c = norm_(code);
  if (c.length < 6) return null;
  for (var i = 0; i < ROSTER.length; i++) if (norm_(ROSTER[i].code) === c) return ROSTER[i];
  return null;
}
function byKey_(key) { for (var i = 0; i < ROSTER.length; i++) if (ROSTER[i].key === key) return ROSTER[i]; return null; }
function peersOf_(me) { return ROSTER.filter(function (p) { return p.group === me.group && p.key !== me.key; }); }
function pub_(p) { return { key: p.key, name: p.name, cls: p.cls }; }
function out_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
function closed_() { return Date.now() > new Date(DUE).getTime(); }

function sheet_(name, header) {
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(header); sh.setFrozenRows(1); }
  return sh;
}
function ratingsSheet_() { return sheet_('Ratings', ['Rater key', 'Rater', 'Rater class', 'Group', 'Peer key', 'Peer', 'Peer class'].concat(CAT_LABELS).concat(['Submitted'])); }
function subsSheet_() { return sheet_('Submissions', ['Cadet key', 'Cadet', 'Class', 'Group', 'Submitted', 'Times submitted']); }
function logSheet_() { return sheet_('Log', ['Received', 'Cadet', 'Class', 'Group', 'Peers rated']); }

function submittedMap_() {
  var sh = subsSheet_(), v = sh.getDataRange().getValues(), m = {};
  for (var i = 1; i < v.length; i++) m[v[i][0]] = { row: i + 1, at: v[i][4], times: Number(v[i][5]) || 0 };
  return m;
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  try {
    if (p.action === 'whoami') {
      var me = byCode_(p.code);
      if (!me) return out_({ ok: false, error: 'That code was not found. Check it and try again.' });
      var s = submittedMap_()[me.key];
      return out_({ ok: true, me: pub_(me), group: me.group, groupLabel: GROUP_LABELS[me.group],
        peers: peersOf_(me).map(pub_), due: DUE, closed: closed_(),
        submittedAt: s ? new Date(s.at).toISOString() : null });
    }
    if (p.action === 'results') {
      if (!p.token || p.token !== CADRE_TOKEN) return out_({ ok: false, error: 'Not authorized.' });
      var subs = submittedMap_();
      var rv = ratingsSheet_().getDataRange().getValues(), ratings = [];
      for (var i = 1; i < rv.length; i++) ratings.push([rv[i][0], rv[i][4]].concat(rv[i].slice(7, 7 + CATS.length).map(Number)));
      return out_({ ok: true, due: DUE, now: new Date().toISOString(), categories: CATS, groups: GROUP_LABELS,
        roster: ROSTER.map(function (r) { var s = subs[r.key];
          return { key: r.key, name: r.name, cls: r.cls, group: r.group, submittedAt: s ? new Date(s.at).toISOString() : null, times: s ? s.times : 0 }; }),
        ratings: ratings });
    }
    return out_({ ok: false, error: 'Unknown request.' });
  } catch (err) { return out_({ ok: false, error: String(err && err.message || err) }); }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (body.action !== 'peer') return out_({ ok: false, error: 'Unknown request.' });
    var me = byCode_(body.code);
    if (!me) return out_({ ok: false, error: 'That code was not found.' });
    if (closed_()) return out_({ ok: false, error: 'Peer Feedback closed at the suspense.' });
    if (submittedMap_()[me.key]) return out_({ ok: false, error: 'You already submitted. Each cadet submits once; see Capt Russell if something needs to change.' });
    var peers = peersOf_(me), r = body.ratings || {};
    if (r[me.key]) return out_({ ok: false, error: 'You cannot rate yourself.' });
    var keys = Object.keys(r);
    if (keys.length !== peers.length) return out_({ ok: false, error: 'Rate every cadet in your group (' + peers.length + ').' });
    for (var i = 0; i < peers.length; i++) {
      var v = r[peers[i].key];
      if (!v || v.length !== CATS.length) return out_({ ok: false, error: 'Missing ratings for ' + peers[i].name + '.' });
      for (var j = 0; j < v.length; j++) if ([1, 2, 3, 4, 5].indexOf(Number(v[j])) < 0) return out_({ ok: false, error: 'Ratings must be 1 to 5.' });
    }
    lock.waitLock(20000);
    var now = new Date(), sh = ratingsSheet_(), data = sh.getDataRange().getValues();
    // Clear any leftover rows for this rater (e.g. after cadre deleted their Submissions row to allow a redo).
    for (var k = data.length - 1; k >= 1; k--) if (data[k][0] === me.key) sh.deleteRow(k + 1);
    var rows = peers.map(function (p) { return [me.key, me.name, me.cls, GROUP_LABELS[me.group], p.key, p.name, p.cls].concat(r[p.key].map(Number)).concat([now]); });
    sh.getRange(sh.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
    var subs = submittedMap_(), s = subs[me.key], ss = subsSheet_();
    if (s) ss.getRange(s.row, 5, 1, 2).setValues([[now, s.times + 1]]);
    else ss.appendRow([me.key, me.name, me.cls, GROUP_LABELS[me.group], now, 1]);
    logSheet_().appendRow([now, me.name, me.cls, GROUP_LABELS[me.group], rows.length]);
    return out_({ ok: true, received: now.toISOString() });
  } catch (err) {
    return out_({ ok: false, error: String(err && err.message || err) });
  } finally { try { lock.releaseLock(); } catch (_) {} }
}
