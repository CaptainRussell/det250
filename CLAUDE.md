# Det 250 Cadet Hub: project context

## Who and what
- Owner: Captain Scott D. Russell, USAF. Operations Flight Commander, AFROTC Detachment 250, Iowa State University (office symbol AFROTC DET 250/OFC). Call him Captain Russell.
- The Det 250 Cadet Hub is a single website that holds every Det 250 cadet tool, so cadets only need one link. It is cadet facing: lead with cadet leadership and cadet tools.
- Writing rule: no em dashes in any drafted text (page copy, messages, docs).

## Where it lives
- Live site: https://captainrussell.github.io/det250/
- Source: GitHub repo `CaptainRussell/det250` (public, GitHub Pages from `main`, root). All work happens here.
- Old repos (`afrotc_pfra`, `Who-is-That-Cadet`, `GMC_Strats_Fall_2026`, `Fall_2026_Flip_Week`) now contain only a forwarding page (`index.html` + `404.html`) that sends old links, including sub-paths, query and hash, to the matching hub folder. Do not build in them.
- Photo source folder on Captain Russell's PC: `C:\Users\Idont\Desktop\Code Projects\Fall 2026 Flip Week Org Chart\Cadet Photos (Cropped)\` with subfolders AS100, AS200, AS250, AS300, AS400, AS500, AS700, AS800, Cadre. Files are named `Last, First M..jpg`.

## Repo layout
| Path | What |
|---|---|
| `index.html` | Hub page. Tools are listed in the `TOOLS` array near the bottom (fields: href, name, tag, tone, icon, section `cadets`, `evaluators` or `instructors`, locked, blurb). Hub sections: Cadet tools, Evaluator tools, Instructor tools. |
| `shared/det250.css` | Det 250 bar styles and cross-page view transitions. |
| `shared/det250-patch.png`, `det250-patch-icon.png` | Det 250 patch (transparent background) and favicon. |
| `pfra/` | AFROTC PFRA Calculator (`index.html`, `app.js`, `src/*.js`, `styles.css`, `pfra-scoring-data.json`, `references/` PDFs + HAMR audio, about 55 MB). |
| `whos-that-cadet/` | Who's That Cadet! face/name flashcard drills, shadow mode, printable cards (`index.html`, `photos/`). |
| `org-chart/` | Fall 2026 Org Chart (`index.html`, `photos/` 240px face crops, `assets/`). |
| `flight-staff-eval/` | Flight Staff Evaluation (formerly GMC Stratification), encrypted behind a password. `gmc-strats/` is now only a redirect here (keeps old links and the old repo forwarding working). |
| `spin-the-wheel/` | Instructor tool: classroom seating chart + cold-call wheel. Room size (rows, seats left/right of aisle) is set on the page; `*` after a name = distance learning. |
| `make-the-call/` | Instructor tool: Agree/Neutral/Disagree leadership debate game (2 to 4 teams, editable statements, sealed scores, podium reveal). |
| `battle-buddy-recon/` | Instructor tool: OPSEC exercise (brief, pairing wheel, recon clock, brief-out queue). |
| `practicum-adventure/` | Instructor tool: Practicum Adventure classroom RPG, copied from the `CaptainRussell/practicum-adventure` repo (that repo still has its own dev tools, tests and docs). GM console + Field Guide use the hub look (`hub-skin.css`); projector (`#player`) and phones (`join.html`) keep the 8-bit look. The leaderboard is local to each browser (`sq_leaderboard`); the Firebase sync (`cloud.js`) was removed in Oct 2026 at Captain Russell's request. `settings.js` holds the Game settings card (instructor name `GM_NAME`, course, IG name, the four NPC rosters), saved in `d250-practicum-settings-v1`. |
| `shared/instructor.css` | Common panels, buttons, fields for instructor tools (load after `det250.css`). |
| `shared/class-roster.js` | `D250Class.load()/save()`: one saved class roster (`d250-class-roster-v1`) and class name (`d250-class-name-v1`, `D250Class.name()`) shared by the instructor tools. Practicum Adventure uses the class name as its course unless its Game settings set one. |
| `tools/encrypt.mjs`, `tools/locked-template.html` | Re-encrypt a password-protected page. |
| `README.md` | Short how-to. |

## Adding a tool
1. Put it in its own folder with `index.html`. Use relative paths only.
2. Add the shared bar: `<link rel="stylesheet" href="../shared/det250.css">` in `<head>`, and copy the `<a class="d250-bar" ...>` line from the top of `org-chart/index.html` to just after `<body>`.
3. Add the standard tool header (`<header class="d250-head" style="--tone:...">`) and footer (`<footer class="d250-foot">`). Markup for both is in the comments in `shared/det250.css`; copy from `org-chart/index.html`. Use the tool's hub card `tone`, and the `--d250-*` tokens for colors.
4. Add one entry to `TOOLS` in the root `index.html`.
5. Avoid localStorage key collisions (all tools share one origin). Existing keys: `det250-wing-memory-v1` (Who's That Cadet), `gmc-strat-v3` (Flight Staff Evaluation, old key name kept so saved work carries over), `d250-gmc-pass` (sessionStorage, GMC unlock), `d250-class-roster-v1` (shared class roster), `d250-class-name-v1` (shared class or course name, set in the "Class" box on each instructor tool), `d250-spin-wheel-v1`, `d250-make-the-call-v1`, `d250-battle-buddy-v1`, `d250-practicum-settings-v1`, and Practicum Adventure's own `sq_*` keys.
6. Instructor tools never ship a built-in roster: names are entered on the page and kept in the browser.

## Password-protected page (Flight Staff Evaluation)
- The published file is AES-GCM encrypted (key from the password via PBKDF2-SHA256, 310k iterations). Without the password the content cannot be read, even in the source. It stays unlocked for the browser tab via sessionStorage.
- To update: edit the plain page locally (never commit it), inject the Det 250 bar, then run
  `node tools/encrypt.mjs plain.html flight-staff-eval/index.html <password> tools/locked-template.html`.
- The password is not stored in this repo; ask Captain Russell.
- Results from Flight Staff Evaluation go to a private spreadsheet via a Google Apps Script URL in its config, not to GitHub.

## Shared design
- Style: "Hub Standard" (chosen Oct 2026). Every tool uses the shared header and footer from `shared/det250.css`, defaults to dark (`data-theme="dark"` on `<html>`; the light palette is still in each page for `data-theme="light"`), and keeps its hub card color only as the header stripe and icon. Who's That Cadet no longer uses the red Pokémon skin.
- Look: matches the hub page. Dark palette: page #16161a, surface #1f1f25, ink #ececee, soft #b2b3b8, line #34343c, ISU cardinal #c8102e / #ef4054, gold #f1be48. Light palette (kept, not the default): page #f4f4f6, surface #fff, ink #1b1b1d. Dark is the default on every page via `data-theme="dark"`. System font stack.
- Det 250 bar: dark strip with a cardinal bottom border, patch icon, gold "Det 250", "Cadet Hub", and an "All tools" pill linking to `../`.
- Footer (all tools): patch, "Optimi In Medio Patrae" (italic), "WE ARE THE STORM", "AFROTC Detachment 250 · Iowa State University", a short source/description line, then "Created by Captain Scott Russell, Operations Flight Commander, AFROTC Detachment 250".
- Pages use `<meta name="robots" content="noindex, nofollow">`.
- Must work at phone width (16px gutters, no sideways scroll), keyboard accessible, and honor reduced motion.

## Org Chart details (`org-chart/index.html`)
All data is in the script near the bottom:
- `PEOPLE`: photo key -> [last, first, class]. Photo file is `photos/<key>.jpg` (key = name with non-letters removed, for example `ReidElijahB`). Missing photos show initials.
- `SEATS`: one row per POC-chart position: `id, des, title, poc:[key, rank], flip (key), parent, dir`, optional `flipDes`, `flipTitle`, `pocDes`. A seat without `flip` is hidden during Flip Week. Cadre seats use `cadre:true` and also have office symbols in `des`.
- `FLIGHTS` (GMC per flight) and `FLIGHTS_POC` (POC per flight), keyed `afl`, `bfl`, `cfl`, `dfl`. Flight member seats are generated from `FLIGHTS`.
- Views: POC Chart (default) and Flip Week (toggle, `?view=flip`). Deep link to a seat with `#<seat id>`.
- Ranks during Flip Week are automatic: AS100 = C/4C, AS200/AS250/AS500 = C/3C.
- AS colors (`RINGS`): AS100 blue, AS200 purple, AS250 teal, AS300 green, AS400 orange, AS500 red, Graybeard (AS700/AS800) navy, Cadre slate.
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
Serve the parent folder (`python3 -m http.server`) so the site loads at `/det250/`, then check with Playwright at 1366 x 900 and 390 x 844, in light and dark, for console errors, failed requests and sideways scroll. Test both org chart views and the GMC lock (wrong and right password).

## Open items
- Archive the three old tool repos on GitHub (optional; forwarding still works).
- Make `GMC_Strats_Fall_2026` private or delete it, so the old unprotected page in its history is no longer public.
- A23/FLI title is a placeholder ("FLI Officer") until the official title is known.
- McConnell's photo file is named "Lauren L." but the roster says "Liam"; the chart uses Liam.
- The ISU cadre page still lists Matthews as Captain; the chart uses Maj.
- `CaptainRussell/practicum-adventure` still serves its own GitHub Pages copy. Once the hub copy is live, replace it with a forwarding page like the other old repos (phones then join through `det250/practicum-adventure/join.html`). Changes made in that repo must be copied here by hand.
