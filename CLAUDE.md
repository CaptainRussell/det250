# Storm HQ (Det 250 Cadet Hub): project context

## Who and what
- Owner: Captain Scott D. Russell, USAF. Operations Flight Commander, AFROTC Detachment 250, Iowa State University (office symbol AFROTC DET 250/OFC). Call him Captain Russell.
- Storm HQ (renamed from "Det 250 Cadet Hub" on 1 Nov 2026; URL and repo name unchanged) is a single website that holds every Det 250 cadet tool, so cadets only need one link. Framing: tools built by the Operations Flight Commander to support cadet operations, plus fun classroom activities. Keep "Det 250" visible next to the Storm HQ name. It is cadet facing: lead with cadet leadership and cadet tools.
- Writing rule: no em dashes in any drafted text (page copy, messages, docs).

## Where it lives
- Live site: https://captainrussell.github.io/det250/
- Source: GitHub repo `CaptainRussell/det250` (public, GitHub Pages from `main`, root). All work happens here.
- The old tool repos (`afrotc_pfra`, `Who-is-That-Cadet`, `GMC_Strats_Fall_2026`, `Fall_2026_Flip_Week`) were deleted on 3 Nov 2026, so their old `captainrussell.github.io/<repo>/` links no longer work. `practicum-adventure` was folded in here the same day (dev tools, tests and docs included) so that repo can be deleted too. Everything lives in this repo now.
- Photo source folder on Captain Russell's PC: `C:\Users\Idont\Desktop\Code Projects\Fall 2026 Flip Week Org Chart\Cadet Photos (Cropped)\` with subfolders AS100, AS200, AS250, AS300, AS400, AS500, AS700, AS800, Cadre. Files are named `Last, First M..jpg`.

## Repo layout
| Path | What |
|---|---|
| `index.html` | Hub page. Its bar is a `<div class="d250-bar d250-bar-hub">` with a "Portfolio" back pill at the top left (to https://captainrussell.github.io/Portfolio/, Captain Russell's portfolio, added Nov 2026) and the Storm HQ home link; tool pages keep the single-link bar. Tools are listed in the `TOOLS` array near the bottom (fields: href, name, tone, icon, section `cadets`, `evaluators` or `instructors`, locked, blurb). Hub sections: Cadet tools, Evaluator tools, Instructor tools. Cards show only icon, name and blurb (no tags, no "Open" arrow, no section subtitles). |
| `shared/det250.css` | Det 250 bar styles and cross-page view transitions. |
| `shared/det250-patch.png`, `det250-patch-icon.png` | Det 250 patch (transparent background) and favicon. |
| `pfra/` | AFROTC PFRA Calculator (`index.html`, `app.js`, `src/*.js`, `styles.css`, `pfra-scoring-data.json`, `references/` PDFs + HAMR audio, about 55 MB). |
| `whos-that-cadet/` | Who's That Cadet! face/name flashcard drills, shadow mode, printable cards (`index.html`, `photos/`). |
| `org-chart/` | Det 250 Org Chart (Fall 2026) (`index.html`, `photos/` 240px face crops, `assets/`). |
| `ribbon-rack/` | Ribbon Rack Builder (cadet tool): cadets check the AFROTC ribbons they've earned and get the rack in order of precedence, with OLCs and stars, 3 or 4 per row, print at actual size, PNG, share link (`#r=...`). Ribbon list, order and stripe colors are in `ribbons.js`, taken from DAFI 36-2903 AFROTC Sup Figure 10.4 (AFROTC Ribbon Chart, Aug 2021, still current per Captain Russell Nov 2026). Prior service (active duty) ribbons are not built; a note says they precede all AFROTC ribbons (Sup 10.8.1.8), per Captain Russell. No JROTC ribbons (Captain Russell). Award criteria under each ribbon come from AFROTCI 36-2011V3 Table 15.1 (a 100 on the PFA adds the Fitness Award silver star); organizational award criteria come from the HQ AFROTC cadet award criteria sheets (Sep 2026 packet from Captain Russell). Awards in that packet without a ribbon on the AFROTC chart are left out. FT Superior Performer is added after FTDG (same ribbon, no device; not on the chart). `references/` holds the AFROTC Sup PDF; the 36-2011V3 PDF is shared from `pfra/references/`. |
| `flight-staff-eval/` | Flight Staff Evaluation (formerly GMC Stratification), a password-encrypted page (lock restored Nov 2026). `gmc-strats/` is now only a redirect here (keeps old links and the old repo forwarding working). |
| `spin-the-wheel/` | Instructor tool: classroom seating chart + cold-call wheel. Room size (rows, seats left/right of aisle) is set on the page; `*` after a name = distance learning. |
| `make-the-call/` | Instructor tool: Agree/Neutral/Disagree leadership debate game (2 to 4 teams, editable statements, sealed scores, podium reveal). |
| `battle-buddy-recon/` | Instructor tool: OPSEC exercise (brief, pairing wheel, recon clock, brief-out queue). |
| `practicum-adventure/` | Instructor tool: Practicum Adventure classroom RPG, moved here from the old `CaptainRussell/practicum-adventure` repo, including its dev tools: `smoke.js` and `sim.js` (run `node smoke.js` in the folder), `tools/` (balance simulator `node tools/run-balance.cjs 3000`, dice build, report previews), `serve.py` / `Play-Locally.bat` / `test.html` for local playtests, and `TESTING.md`, `BALANCE-REVIEW.md`, `DESIGN-PROPOSALS.md`. The removed Firebase sync is kept for reference in `archive/firebase/` (not loaded by any page). Node test harnesses must load `settings.js` before `data.js`. GM console + Field Guide use the hub look (`hub-skin.css`); projector (`#player`) and phones (`join.html`) keep the 8-bit look. The leaderboard is local to each browser (`sq_leaderboard`); the Firebase sync (`cloud.js`) was removed in Oct 2026 at Captain Russell's request. `settings.js` holds the Game settings card (instructor name `GM_NAME`, course, IG name, the four NPC rosters), saved in `d250-practicum-settings-v1`. |
| `shared/instructor.css` | Common panels, buttons, fields for instructor tools (load after `det250.css`). |
| `shared/instructor.js` | `D250Steps` (numbered step tabs in the header, step 1 is always Roster, Next button bottom right) `D250Roster` (the common roster panel: preset group toggles, paste box, Load saved class, Clear, Save roster) `D250Wheel` (the one name wheel look and spin for every instructor tool: Make the Call colored slices, gold needle, a fast spin that slows into a slow creep before it stops) and `D250Face.html(name, size)` (Org Chart style round photo with the AS class color ring from `org-chart/photos`, initials for names not on the chart; used in attendance lists, seats, team lists, chips, pairing slots and the called/speaker readouts). Used by Spin the Wheel, Make the Call and Battle Buddy Recon. |
| `shared/cadet-groups.js` | Preset roster groups (AS 100's, AS 200's, AS 250's, AS 500's, AS 300's, AS 400's, Graybeards) and `D250Cadets` ("last, first" -> photo key, class). GENERATED from `PEOPLE` in `org-chart/index.html` by `node tools/build-cadet-groups.mjs`; rerun it after roster changes. |
| `shared/class-roster.js` | `D250Class.load()/save()`: one saved class roster (`d250-class-roster-v1`) and class name (`d250-class-name-v1`, `D250Class.name()`) shared by the instructor tools. Practicum Adventure uses the class name as its course unless its Game settings set one. |
| `documents/` | Documents and Policy (cadet tool, Nov 2026): one-stop list of every regulation, notice and form cited by the Storm HQ tools, The Storm Standard, the OPLAN and the Policy Packet (`DOCS` array in `documents/index.html`; every document is a hub-style one-click card. Air Force pubs link to official e-Publishing; AFROTCI 36-2011 V1 and V2 are hosted in `documents/references/`, V3 and the AFROTC supplements are shared from `pfra/references/` and `ribbon-rack/references/`. NOTACCs and the law section were removed at Captain Russell's request, Nov 2026). The main page shows only "Read the Standard" for The Storm Standard, has no search bar, and each category collapses (state in `d250-docs-sections-v1`). One "Enter password to unlock" box above the plans unlocks every protected card with a staggered animation; clicking a locked card makes the box glow. The reader shows one section per tab (`#chapter-N`, `#appendix-i`, `#p-N` deep links); the open tab expands in the side nav to its subsections (`SUBS` in the build script, 8 or fewer per chapter, grouped by hand). `documents/storm-standard/` holds The Storm Standard PDF (`The_Storm_Standard.pdf`, First Edition Sep 2026) and its web edition, GENERATED by `pdftotext The_Storm_Standard.pdf ss.txt` then `node tools/build-storm-standard.mjs ss.txt documents/storm-standard/index.html` (copy a new edition's PDF in first so the download size updates). `documents/restricted/` holds the Fall 2026 OPLAN, Policy Packet, Cadre Additional Duties Roster and weekly OPORDs ENCRYPTED (`*.bin` + `vault.json`); each card opens `documents/view/?id=<id>`, which asks for the password once per tab, decrypts in the browser and renders the pages with the vendored PDF.js 3.11.174 (`documents/vendor/pdfjs/`), with a back button, previous/next and download (default set by Captain Russell, Nov 2026; never write it in the repo). |
| `tools/encrypt-files.mjs` | Encrypts the restricted PDFs: keep the plain PDFs and a `list.json` OUTSIDE the repo, then `node tools/encrypt-files.mjs <password> <list.json> documents/restricted`. Rebuilds every file (new salt each run), so to add an OPORD or change the password rerun the whole list. `documents/restricted/.gitignore` blocks `*.pdf`. Anyone with the password can download and repost the decrypted files. |
| `tools/encrypt.mjs`, `tools/locked-template.html` | Encrypt a page behind a password (used by Flight Staff Evaluation). |
| `README.md` | Short how-to. |

## Adding a tool
1. Put it in its own folder with `index.html`. Use relative paths only.
2. Add the shared bar: `<link rel="stylesheet" href="../shared/det250.css">` in `<head>`, and copy the `<a class="d250-bar" ...>` line from the top of `org-chart/index.html` to just after `<body>`.
3. Add the standard tool header (`<header class="d250-head" style="--tone:...">`) and footer (`<footer class="d250-foot">`). Markup for both is in the comments in `shared/det250.css`; copy from `org-chart/index.html`. Use the tool's hub card `tone`, and the `--d250-*` tokens for colors.
4. Add one entry to `TOOLS` in the root `index.html`.
5. Avoid localStorage key collisions (all tools share one origin). Existing keys: `det250-wing-memory-v1` (Who's That Cadet), `gmc-strat-v3` (Flight Staff Evaluation, old key name kept so saved work carries over), `d250-gmc-pass` (sessionStorage, GMC unlock), `d250-class-roster-v1` (shared class roster), `d250-class-name-v1` (shared class or course name, set in the "Class" box on each instructor tool), `d250-spin-wheel-v1`, `d250-make-the-call-v1`, `d250-battle-buddy-v1`, `d250-practicum-settings-v1`, `d250-ribbon-rack-v1`, `d250-docs-pass` (sessionStorage, Documents and Policy unlock), `d250-docs-sections-v1` (collapsed categories), and Practicum Adventure's own `sq_*` keys.
6. Instructor tools use the standard screen from `shared/instructor.js`: Class box + step tabs in the header, step 1 Roster (roster panel left, tool setup right), a Next button at the bottom right of each step, tool controls on the right of each step heading. Rosters start empty; the only built-in names are the optional org chart preset groups in `shared/cadet-groups.js` (added Oct 2026 at Captain Russell's request).

## Flight Staff Evaluation
- Encrypted HTML in `flight-staff-eval/index.html` (password lock restored at Captain Russell's request, Nov 2026). Decrypt outside the repo to edit; roster, evaluator roles, photos and submit settings live in `CONFIG` in the decrypted page. Never commit decrypted source or the password.
- Results go to a private spreadsheet via the Google Apps Script `submitUrl` in `CONFIG`, not to GitHub. That URL is inside the encrypted payload. Previously public copies remain in Git history.
- To rebuild the lock: keep the plain page outside the repo and run `node tools/encrypt.mjs plain.html flight-staff-eval/index.html <password> tools/locked-template.html`.

## Shared design
- Style: "Hub Standard" (chosen Oct 2026). Every tool uses the shared header and footer from `shared/det250.css`, defaults to dark (`data-theme="dark"` on `<html>`; the light palette is still in each page for `data-theme="light"`), and keeps its hub card color only as the header stripe and icon. Who's That Cadet no longer uses the red Pokémon skin.
- Look: matches the hub page. Dark palette: page #16161a, surface #1f1f25, ink #ececee, soft #b2b3b8, line #34343c, ISU cardinal #c8102e / #ef4054, gold #f1be48. Light palette (kept, not the default): page #f4f4f6, surface #fff, ink #1b1b1d. Dark is the default on every page via `data-theme="dark"`. System font stack.
- Det 250 bar: dark strip with a cardinal bottom border, patch icon, gold "Storm HQ", gray "Det 250" (hidden only under 340px wide), and an "All tools" pill linking to `../`.
- Page titles end in " · Storm HQ" (hub: "Storm HQ · Det 250").
- Footer (all tools): patch, "Optimi In Medio Patrae" (italic), "WE ARE THE STORM", "Storm HQ · AFROTC Detachment 250 · Iowa State University", a short source/description line, then "Created by Captain Scott Russell, Operations Flight Commander, AFROTC Detachment 250".
- Pages use `<meta name="robots" content="noindex, nofollow">`.
- Must work at phone width (16px gutters, no sideways scroll), keyboard accessible, and honor reduced motion.

## Org Chart details (`org-chart/index.html`)
All data is in the script near the bottom:
- `PEOPLE`: photo key -> [last, first, class]. Photo file is `photos/<key>.jpg` (key = name with non-letters removed, for example `ReidElijahB`). Missing photos show initials.
- `SEATS`: one row per POC-chart position: `id, des, title, poc:[key, rank], flip (key), parent, dir`, optional `flipDes`, `flipTitle`, `pocDes`. A seat without `flip` is hidden during Flip Week. Cadre seats use `cadre:true` and also have office symbols in `des`.
- `position-descriptions.js` stores position-based OPLAN critical roles and full responsibility bullets, plus cited cadre summaries from the supplied Vol 2 and Vol 3, primary/alternate duties from the signed 27 July 2026 duty memo, and Capt Russell’s clarification of the secretary’s ISU liaison role. The detail drawer uses shared squadron/flight descriptions in both views. The seven GMC deputy seats without separate OPLAN descriptions use supporting duties based on Capt Russell’s local guidance and their supervisor’s OPLAN scope; responsibility remains with the supervisor. The Flip Week GMCIC role still has an explicit source-gap note. Keep source paragraph/page citations with duty updates.
- `FLIGHTS` (GMC per flight) and `FLIGHTS_POC` (POC per flight), keyed `afl`, `bfl`, `cfl`, `dfl`. Flight member seats are generated from `FLIGHTS`.
- Views: POC Chart (default) and Flip Week (toggle, `?view=flip`). Deep link to a seat with `#<seat id>`.
- Ranks during Flip Week are automatic: AS100 = C/4C, AS200/AS250/AS500 = C/3C.
- AS colors (`RINGS`): AS100 blue, AS200 purple, AS250 teal, AS300 green, AS400 orange, AS500 red, Graybeard (AS700/AS800) navy, Cadre slate.
- No class-color legend row, no "Showing the ... chart" line, and no "Chart" row in the details pane (removed Oct 2026).
- Features: Cadre section collapsed by default; Wing Command Team, A-Staff Directorates, Group Staff; "View flight" window per FLT/CC with GMC and POC tabs; details drawer (flight, reports to, leads, Flip Week position); hover pop-out of supervisors and subordinates; search.
- GMC with a wing position report to both their wing supervisor and their FLT/CC.

### Cadre (Fall 2026)
| Name | Position | Office symbol | Reports to |
|---|---|---|---|
| Lt Col John D. Cacic | Detachment Commander | DET 250/CC | |
| Maj Jordan D. Matthews | Education Officer | DET 250/EO | Cacic |
| Capt Scott D. Russell | Operations Flight Commander | DET 250/OFC | Cacic (leads the cadet WG/CC) |
| Capt Ty A. Orr | Recruiting Officer | DET 250/RO | Cacic |
| Ms. Tina (Tina Schmalzried) | Detachment Secretary | none | Cacic |
| TSgt Matthew J. Cabral | Officer Accessions Instructor | DET 250/OAI | Orr |
| SSgt Gabrielle L. Moore | NCOIC, Administration | DET 250/HRA | Cabral |
Cadre display order left to right: Matthews, Russell, Orr (with Cabral, Moore), Ms. Tina.

## Photo pipeline
Crop to a 240 x 240 face-centered square (face about 38% of the width), JPEG quality about 82, progressive. Faces come from stored coordinates or OpenCV Haar detection. Patch cutouts must clear every white region touching the image border, not just the corners.

## Testing before pushing
Serve the parent folder (`python3 -m http.server`) so the site loads at `/det250/`, then check with Playwright at 1366 x 900 and 390 x 844, in light and dark, for console errors, failed requests and sideways scroll. Test both org chart views and Flight Staff Evaluation.

## Open items
- McConnell's photo file is named "Lauren L." but the roster says "Liam"; the chart uses Liam.
- The ISU cadre page still lists Matthews as Captain; the chart uses Maj.
- `node smoke.js` in `practicum-adventure/` was already failing in the old repo: some checks expect an older game flow (first failure: "icon selection returns to the job overview"). Update those checks to the current flow before relying on it. Phones join through `det250/practicum-adventure/join.html` (the room QR code uses the page's own address).
