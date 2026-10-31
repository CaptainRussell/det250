# Det 250 Cadet Hub

One site for every AFROTC Detachment 250 tool: https://captainrussell.github.io/det250/

| Folder | Tool |
|---|---|
| `/` | Hub page (lists every tool) |
| `pfra/` | PFRA Calculator |
| `whos-that-cadet/` | Who's That Cadet! |
| `org-chart/` | Fall 2026 Org Chart (POC chart + Flip Week) |
| `gmc-strats/` | Flight Staff Evaluation (password protected) |
| `shared/` | Det 250 bar, page transitions, patch |

## Adding a tool
1. Put the tool in its own folder, with its page at `<folder>/index.html`.
2. Add the shared bar so it matches the rest of the site: in `<head>` add
   `<link rel="stylesheet" href="../shared/det250.css">`, and copy the `<a class="d250-bar" ...>` line
   from the top of `org-chart/index.html` to just after `<body>`.
3. Add one entry to the `TOOLS` list in the root `index.html`.

## Password-protected pages
`gmc-strats/index.html` is encrypted (AES-GCM, key from the password via PBKDF2), so its contents
can't be read without the password, even in the page source. To update it, edit the plain page
locally (never commit it), then re-encrypt:

    node tools/encrypt.mjs plain.html gmc-strats/index.html <password> tools/locked-template.html
