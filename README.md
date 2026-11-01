# Det 250 Cadet Hub

One site for every AFROTC Detachment 250 tool: https://captainrussell.github.io/det250/

| Folder | Tool |
|---|---|
| `/` | Hub page (lists every tool) |
| `pfra/` | PFRA Calculator |
| `whos-that-cadet/` | Who's That Cadet! |
| `org-chart/` | Fall 2026 Org Chart (POC chart + Flip Week) |
| `ribbon-rack/` | Ribbon Rack Builder (AFROTC cadet ribbons, order of precedence, devices) |
| `flight-staff-eval/` | Flight Staff Evaluation. `gmc-strats/` redirects here. |
| `spin-the-wheel/` | Spin the Wheel (seating chart + cold-call wheel) |
| `make-the-call/` | Make the Call (leadership debate game) |
| `battle-buddy-recon/` | Battle Buddy Recon (OPSEC exercise) |
| `practicum-adventure/` | Practicum Adventure (classroom RPG; see its `HOW-TO-RUN.md`) |
| `shared/` | Det 250 bar, page transitions, patch, instructor tool styles, shared class roster |

## Adding a tool
1. Put the tool in its own folder, with its page at `<folder>/index.html`.
2. Add the shared bar so it matches the rest of the site: in `<head>` add
   `<link rel="stylesheet" href="../shared/det250.css">`, and copy the `<a class="d250-bar" ...>` line
   from the top of `org-chart/index.html` to just after `<body>`.
3. Add one entry to the `TOOLS` list in the root `index.html`.

## Password-protected pages
No page is locked right now (Flight Staff Evaluation was unlocked in Oct 2026). To lock a page,
keep the plain page out of the repo and encrypt it:

    node tools/encrypt.mjs plain.html <folder>/index.html <password> tools/locked-template.html
