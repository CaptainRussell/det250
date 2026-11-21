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
     POST {action:"peer", code, ratings:{peerKey:[lead,prof,team,comm]}, comments:{peerKey:"optional text"}}
   Late submissions (Capt Russell, 20 Nov 2026): after DUE a cadet can still submit with the same code;
   the row is marked Late in Ratings, Submissions and Log, and results carry late:true for the Cadre Dashboard.
   Set ACCEPT_LATE = false to stop taking submissions after DUE.
   Tabs it keeps: Ratings (one row per rater and peer). ONE submission per cadet: to let a cadet redo it, delete their rows in Submissions and Ratings,
   Submissions (one row per cadet), Log (every accepted submit). */

var CATS = ['lead', 'prof', 'team', 'comm'];
var CAT_LABELS = ['Leadership', 'Professionalism', 'Teamwork', 'Communication'];
var GROUP_LABELS = { poc: 'POC', gmc: 'AS 200 / 250 / 500', as100: 'AS 100' };
// Cadets nobody rates (they still sign in and rate their own group). Capt Russell, 12 Nov 2026.
var NOT_RATED = [];
var NOTE_MAX = 600;   // characters kept per optional comment
var ACCEPT_LATE = true;   // take submissions after DUE and mark them Late (Capt Russell, 20 Nov 2026)

function norm_(code) { return String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
function byCode_(code) {
  var c = norm_(code);
  if (c.length < 6) return null;
  for (var i = 0; i < ROSTER.length; i++) if (norm_(ROSTER[i].code) === c) return ROSTER[i];
  return null;
}
function byKey_(key) { for (var i = 0; i < ROSTER.length; i++) if (ROSTER[i].key === key) return ROSTER[i]; return null; }
function rated_(p) { return NOT_RATED.indexOf(p.key) < 0; }
function peersOf_(me) { return ROSTER.filter(function (p) { return p.group === me.group && p.key !== me.key && rated_(p); }); }
// Plain text only; a leading = + - @ would make the Sheet treat it as a formula.
function note_(t) { t = String(t == null ? '' : t).replace(/\r\n?/g, '\n').trim().slice(0, NOTE_MAX); return /^[=+\-@]/.test(t) ? "'" + t : t; }
function pub_(p) { return { key: p.key, name: p.name, cls: p.cls }; }
function out_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
function closed_() { return Date.now() > new Date(DUE).getTime(); }
function lateAt_(at) { return !!at && new Date(at).getTime() > new Date(DUE).getTime(); }

function sheet_(name, header) {
  var ss = SpreadsheetApp.getActive(), sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(header); sh.setFrozenRows(1); }
  return sh;
}
var R_HEAD = ['Rater key', 'Rater', 'Rater class', 'Group', 'Peer key', 'Peer', 'Peer class'].concat(CAT_LABELS).concat(['Submitted', 'Comment', 'Late']);
var R_NOTE = R_HEAD.length - 2;   // column index of the comment (added 12 Nov 2026, after Submitted)
// Adds a header a sheet made before that column existed is missing (Comment 12 Nov, Late 20 Nov 2026).
function head_(sh, col, name) { if (sh.getRange(1, col).getValue() !== name) sh.getRange(1, col).setValue(name); return sh; }
function ratingsSheet_() { var sh = sheet_('Ratings', R_HEAD); head_(sh, R_NOTE + 1, 'Comment'); return head_(sh, R_NOTE + 2, 'Late'); }
function subsSheet_() { return head_(sheet_('Submissions', ['Cadet key', 'Cadet', 'Class', 'Group', 'Submitted', 'Times submitted', 'Late']), 7, 'Late'); }
function logSheet_() { return head_(sheet_('Log', ['Received', 'Cadet', 'Class', 'Group', 'Peers rated', 'Comments', 'Late']), 7, 'Late'); }

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
        peers: peersOf_(me).map(pub_), due: DUE, closed: closed_(), acceptLate: ACCEPT_LATE,
        submittedAt: s ? new Date(s.at).toISOString() : null, late: s ? lateAt_(s.at) : false });
    }
    if (p.action === 'results') {
      if (!p.token || p.token !== CADRE_TOKEN) return out_({ ok: false, error: 'Not authorized.' });
      var subs = submittedMap_();
      var rv = ratingsSheet_().getDataRange().getValues(), ratings = [];
      // [rater, peer, lead, prof, team, comm, comment]
      for (var i = 1; i < rv.length; i++) ratings.push([rv[i][0], rv[i][4]].concat(rv[i].slice(7, 7 + CATS.length).map(Number)).concat([String(rv[i][R_NOTE] || '').replace(/^'/, '')]));
      return out_({ ok: true, due: DUE, acceptLate: ACCEPT_LATE, now: new Date().toISOString(), categories: CATS, groups: GROUP_LABELS,
        roster: ROSTER.map(function (r) { var s = subs[r.key];
          return { key: r.key, name: r.name, cls: r.cls, group: r.group, rated: rated_(r), submittedAt: s ? new Date(s.at).toISOString() : null, late: s ? lateAt_(s.at) : false, times: s ? s.times : 0 }; }),
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
    var late = closed_();
    if (late && !ACCEPT_LATE) return out_({ ok: false, error: 'Peer Feedback closed at the suspense.' });
    if (submittedMap_()[me.key]) return out_({ ok: false, error: 'You already submitted. Each cadet submits once; see Capt Russell if something needs to change.' });
    var peers = peersOf_(me), r = body.ratings || {}, notes = body.comments || {};
    if (r[me.key]) return out_({ ok: false, error: 'You cannot rate yourself.' });
    var keys = Object.keys(r).filter(function (k) { return peers.some(function (p) { return p.key === k; }); });   // an old draft may still hold a removed cadet
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
    var nNotes = 0;
    var rows = peers.map(function (p) { var t = note_(notes[p.key]); if (t) nNotes++;
      return [me.key, me.name, me.cls, GROUP_LABELS[me.group], p.key, p.name, p.cls].concat(r[p.key].map(Number)).concat([now, t, late ? 'Late' : '']); });
    sh.getRange(sh.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
    var subs = submittedMap_(), s = subs[me.key], ss = subsSheet_();
    if (s) ss.getRange(s.row, 5, 1, 3).setValues([[now, s.times + 1, late ? 'Late' : '']]);
    else ss.appendRow([me.key, me.name, me.cls, GROUP_LABELS[me.group], now, 1, late ? 'Late' : '']);
    logSheet_().appendRow([now, me.name, me.cls, GROUP_LABELS[me.group], rows.length, nNotes, late ? 'Late' : '']);
    return out_({ ok: true, received: now.toISOString(), late: late });
  } catch (err) {
    return out_({ ok: false, error: String(err && err.message || err) });
  } finally { try { lock.releaseLock(); } catch (_) {} }
}
