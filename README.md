# ⚡ Storm HQ (Det 250)

One site for AFROTC Detachment 250 tools, built by Captain Scott Russell (Operations Flight Commander) to support cadet operations, plus classroom activities.
**Live site:** https://captainrussell.github.io/det250/

## Cadet Tools
- **PFRA Calculator** (`pfra/`): scores a PFRA against the 2026 USAF charts, with goal pace per lap and track layout marks (where to wheel the start lines) for the OFC.
- **Ribbon Rack Builder** (`ribbon-rack/`): builds your AFROTC rack in order of precedence (DAFI 36-2903 AFROTC Sup), with devices and the wear and award criteria for each ribbon.
- **Det 250 Org Chart** (`org-chart/`): cadre, wing staff, flights and the Flip Week view. *Reflects Fall 2026 and may be out of date.*
- **Who's That Cadet!** (`whos-that-cadet/`): memorization game for cadet faces, with printable cards.

## Evaluator Tools
- **Flight Staff Evaluation** (`flight-staff-eval/`): rate and stratify GMC cadets by flight. Results go to a private cadre spreadsheet.

## Instructor Tools
- **Practicum Adventure** (`practicum-adventure/`): a video game style practicum cadets join and play from their phones. Tests objectives from the AFAS 3410 and 3420 series.
- **Spin the Wheel** (`spin-the-wheel/`): seating chart and name wheel for cold calls, with a pop-out wheel.
- **Make the Call** (`make-the-call/`): team debate game where cadets agree, stay neutral or disagree with leadership statements.
- **Battle Buddy Recon** (`battle-buddy-recon/`): OPSEC exercise that pairs cadets, runs an open-source recon clock, then a brief-out.

## Notes
- Hosted on GitHub Pages from `main`. Pushed changes go live in a few minutes.
- To add a tool: give it its own folder with `index.html`, add the shared bar (`shared/det250.css`, copy the bar from `org-chart/index.html`), and add one entry to `TOOLS` in the root `index.html`. Full details are in `CLAUDE.md`.
- Award criteria change year to year. When sources conflict, follow the DAFI 36-2903 AFROTC Supplement.
- No page is password locked. To lock one: `node tools/encrypt.mjs plain.html <folder>/index.html <password> tools/locked-template.html`
