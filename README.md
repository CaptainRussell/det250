# ⚡ Storm HQ (Det 250)

One site for AFROTC Detachment 250 tools, built by Captain Scott Russell (Operations Flight Commander) to support cadet operations, plus classroom activities.
**Live site:** https://captainrussell.github.io/det250/

## Cadet Tools
- **PFRA Calculator** (`pfra/`): scores a PFRA against the 2026 USAF charts, with goal pace per lap and track layout marks (where to wheel the start lines) for the OFC.
- **Ribbon Rack Builder** (`ribbon-rack/`): builds your AFROTC rack in order of precedence (DAFI 36-2903 AFROTC Sup), with devices and the wear and award criteria for each ribbon.
- **Det 250 Org Chart** (`org-chart/`): cadre, wing staff, flights and the Flip Week view. *Reflects Fall 2026 and may be out of date.*
- **Documents and Policy** (`documents/`): The Storm Standard plus every AFI, DAFI, AFROTCI, notice and form the detachment uses, with links to the official sources. The Fall 2026 OPLAN, Policy Packet, cadre duties roster and OPORDs are encrypted and open with the detachment password in a built-in viewer.
- **Who's That Cadet!** (`whos-that-cadet/`): memorization game for cadet faces, with printable cards.

## Evaluator Tools
- **Flight Staff Evaluation** (`flight-staff-eval/`): rate and stratify GMC cadets by flight. Results go to a private cadre spreadsheet.
- **Peer Feedback** (`peer-feedback/`): each cadet signs in with a personal code and rates every cadet in their peer group (POC, AS 200/250/500, AS 100) 1 to 5 in Leadership, Professionalism, Teamwork and Communication. Results go to a private cadre spreadsheet.
- **Cadre Dashboard** (`cadre/`): cadre password. Peer Feedback rankings (adjusted for easy and harsh raters, filter by AS level), rater check, cadet breakdowns, and Flight Staff Evaluation results, plus who still owes each evaluation.

## Instructor Tools
- **Practicum Adventure** (`practicum-adventure/`): a video game style practicum cadets join and play from their phones. Tests objectives from the AFAS 3410 and 3420 series.
- **Spin the Wheel** (`spin-the-wheel/`): seating chart and name wheel for cold calls, with a pop-out wheel.
- **Make the Call** (`make-the-call/`): team debate game where cadets agree, stay neutral or disagree with leadership statements.
- **Battle Buddy Recon** (`battle-buddy-recon/`): OPSEC exercise that pairs cadets, runs an open-source recon clock, then a brief-out.

## Notes
- Editable data lives in `data/`: `roster.js` (the one detachment roster used by the Org Chart, instructor tools and Peer Feedback) and `hub.js` (the hub cards). Change people and cards there, not in page code.
- Hosted on GitHub Pages from `main`. Pushed changes go live in a few minutes.
- To add a tool: give it its own folder with `index.html`, add the shared bar (`shared/det250.css`, copy the bar from `org-chart/index.html`), and add one entry to `data/hub.js`. Full details are in `CLAUDE.md`.
- Award criteria change year to year. When sources conflict, follow the DAFI 36-2903 AFROTC Supplement.
- Flight Staff Evaluation is password encrypted. Keep decrypted source outside the public repo. To rebuild its lock: `node tools/encrypt.mjs plain.html <folder>/index.html <password> tools/locked-template.html`
- Restricted documents are encrypted. Keep the plain PDFs outside the repo. To rebuild: `node tools/encrypt-files.mjs <password> <list.json> documents/restricted` (see the script header for the list format).
- Peer Feedback codes and its Apps Script are private. Build them OUTSIDE the repo with `node tools/build-peer-feedback.mjs <private folder>` (keeps existing codes), then paste `PeerFeedback.gs` into the Peer Feedback Sheet's Apps Script. The Cadre Dashboard's connection settings are encrypted in `cadre/vault.json`: `node tools/build-cadre-vault.mjs <cadre password> <config.json>`.
