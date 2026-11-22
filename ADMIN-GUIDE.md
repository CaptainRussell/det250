# Storm HQ admin guide

This guide is for the cadre member who keeps Storm HQ up to date after Captain Russell. You don't need to know how to code. **Storm HQ is changed by asking Claude** (or another AI coding assistant) to edit its GitHub repository, the same way it was built: you describe the change, Claude makes it and shows you, and you say merge.

- Live site: https://captainrussell.github.io/det250/
- Admin page: https://captainrussell.github.io/det250/admin-hub/ (the **Admin** card on the home page after you sign in with the cadre password). It has the results, this guide with ready-to-copy prompts, and the links below.
- Source: https://github.com/CaptainRussell/det250

## Get set up once

1. A Claude plan that includes Claude Code (Pro or higher).
2. A GitHub account that can edit the repository. The current owner adds you under the repository's Settings, Collaborators (or hands over the detachment account; see the handoff below).
3. Open https://claude.ai/code, connect GitHub, allow the Claude GitHub app on the repository, and pick it. There is no access key to copy: signing in to GitHub is the key.

## How a change works

1. **Start a new session for each job** and say what you want in plain words, like you would to a sharp cadet. Attach what it needs: rosters, photos (a zip, files named `Last, First M.jpg`), PDFs.
2. Claude reads `CLAUDE.md` in the repository first. It holds every rule and past decision for the site, so you don't have to explain the background.
3. Claude makes the change on a branch, checks the pages on a desktop and a phone, and opens a **pull request** with a short summary.
4. Read the summary, ask for changes, and say **merge** when it looks right. The live site updates a minute or two later. Check it.
5. **Undo:** every change is kept in GitHub's history. Say "undo the change from pull request [number]".

Tips:

- One job per session gives clean pull requests that are easy to check.
- Give a password in the chat only when the job needs it (locked documents, the ODT Tool, Flight Staff Evaluation). Claude uses it and never writes it into the repository.
- When you decide a new rule ("ranks stay with the position"), tell Claude to add it to `CLAUDE.md` so every later session follows it.
- Other AI coding assistants that can edit a GitHub repository (GitHub Copilot, ChatGPT Codex, Cursor) can do the same jobs. `AGENTS.md` points them to `CLAUDE.md`.

## What changes, and what to ask

Fill in the parts in [brackets]. The Admin page has these with Copy buttons.

| Tool | How often | Example requests |
| --- | --- | --- |
| People and photos (the one roster every tool reads) | Each semester | "Start the [Spring 2027] roster. The new roster is attached: add the new cadets, remove anyone not on it, move everyone to their new AS class and flight, and set the semester to [Spring 2027]. Photos are in the attached zip." / "[Cadet] left the program. Remove them and tell me which positions they held." |
| Det 250 Org Chart | Each semester | "Freeze [Fall 2026] and make [Spring 2027] the current semester with a POC Chart and a Flip Week chart. Positions and ranks are in the attached [OPLAN]." / "Add the proposed wing packages for [semester], cadre only." |
| ODT Tool | Each ODT | "Add a new ODT: [name], [place], [dates]. Roster attached. Pair rooms by our rules, set up [number] vans with [drivers], add the attached itinerary. The cadet password is [password]." |
| Evaluation Tools | Each semester | "Open Peer Feedback for [Spring 2027], due [date and time]. I've downloaded last semester's CSV. Rebuild the codes and code slips and walk me through deploying the Apps Script." / "Update the Flight Staff Evaluation for [semester] from the current org chart. The Flight Staff password is [password]." |
| Documents and Policy | Each semester | "Replace the OPLAN and Policy Packet with the attached [Spring 2027] versions, locked with the cadet password [password]." / "Add OPORD Week [n] (attached)." |
| Hub cards and passwords | As needed | "Hide the [tool] card for now." / "Change the cadet password to [new] everywhere it is used. The current one is [old]." |
| PFRA Calculator, Ribbon Rack Builder | Rarely, when the regulation changes | "DAFMAN 36-2905 has a new edition (attached). Update the PFRA Calculator." |
| Instructor tools | Rarely | "In [Make the Call], [describe the change]." |

## Start of each semester (August and January)

Ask for these in order, one session each:

1. The new roster and photos.
2. The Org Chart: freeze the old semester, set up the new one.
3. Documents and Policy: the new OPLAN, Policy Packet and Cadre Additional Duties Roster, then OPORDs as they come out.
4. Evaluation Tools: open Peer Feedback with the new due date, and update the Flight Staff Evaluation.
5. The ODT Tool, when the first ODT is planned.

## Signing in to Storm HQ

When someone opens Storm HQ, the home page asks for a password once per browser tab:

- The **cadet password** (the Documents and Policy password) opens the locked plans, OPORDs and the ODT Tool.
- The **cadre password** (the admin password) shows the **Admin** card and opens the Cadre Dashboard too.
- **Skip for now** shows every open tool; each locked tool asks for its own password.

"Keep me signed in on this device" is ticked by default. Untick it on a shared computer.

## Outside GitHub

Claude can't reach these directly, so they are handed over in person:

- **Google Apps Scripts and Sheets** for Peer Feedback and Flight Staff Evaluation (https://script.google.com). Claude writes the script and tells you what to paste and how to deploy it.
- **The Google account** that owns those scripts and sheets.
- **The passwords** (cadet, Flight Staff, cadre). Tell new cadre in person.

## Before the handoff

1. Move the repository to a detachment GitHub account (or add the new point of contact as an owner), and allow the Claude app there. The site address changes with the owner, so update links and QR codes.
2. Transfer the Google Apps Scripts and Sheets to a detachment Google account.
3. Change the cadet, Flight Staff and cadre passwords, and tell the new cadre in person.
4. Have the new point of contact run one small job with Claude while you watch.

## Backup: the Cadre Admin editor

The old point-and-click editor (https://captainrussell.github.io/det250/admin/, linked at the bottom of the Admin page) still works for quick roster, card, document, ODT and password edits. It saves straight to GitHub with a stored access key. Claude is the main way to change Storm HQ; use the editor only if it is quicker for a small edit.

### Editor jobs

#### Start a new semester

Do this each August and January, after the new cadet wing is set.

1. **Org chart tab, Semesters:** press **Freeze** on the semester that just ended. Its POC chart and Flip Week keep the people and positions they have today, so the steps below don't change them.
2. **Org chart tab, Semesters:** open the new semester (or **Add a semester**), set it as the current semester, and give it a POC Chart and a Flip Week chart. Remove the proposed packages that weren't picked, or the picked one too once its people are in the positions.
3. **People tab:** set **Semester shown on the tools** (for example "Spring 2027").
4. **People tab:** add new cadets, remove cadets who left, and fix classes (AS 100 to AS 200 and so on). Set each cadet's flight.
5. **Org chart tab:** put the new cadet staff in each position, with ranks. Set the Flip Week holder for each position, or leave it hidden.
6. **Hub cards tab:** update any card that names a semester or a due date (for example the Org Chart and Peer Feedback cards).
7. **Documents tab:** check the links still work. Upload or link any new instruction.
8. Publish, then look over the Org Chart and Know Your Wing on the live site.
9. Ask whoever runs Peer Feedback to rebuild the cadet codes (see "What the admin page doesn't do").

#### Add a cadet

1. People tab, **Add a person**.
2. Enter last name, first name, middle initial and class. Pick their flight.
3. **Choose a photo**. The page finds the face and centers it in the circle by itself (nothing is uploaded until you publish). If it looks off, drag the photo or use the zoom slider; **Center on face** puts it back. If no face is found, line it up by hand.
4. Press **Add**, then publish.

#### Change a photo

Open the person on the People tab, choose a new photo (it centers on the face by itself), adjust if needed, save and publish. The page saves a small copy for the Org Chart and a larger, looser copy for Know Your Wing, framed like the existing photos.

#### Remove a cadet

Open the person and press **Remove from roster**. If they still hold a position, the page tells you which one. Put someone else in that position on the Org chart tab first.

#### Change who holds a position

On the Org chart tab, press **Edit** on the position. Pick who holds it, their rank, who holds it during Flip Week, and who it reports to. **Add a position** creates a new one. Flip Week ranks are set automatically.

#### Add or change a semester on the Org Chart

The Org Chart opens on a home page with a card for each semester. Each semester has a button for each of its charts:

- **POC Chart** and **Flip Week** show the positions on the Org chart tab (or, once the semester is frozen, the copy saved when you pressed **Freeze**).
- **Proposed package** shows a wing command package. Packages are kept in `org-chart/packages/<semester>.json`, open to everyone (Spring 2027 was opened on 20 Nov 2026). A semester can instead be locked with the cadre password (`org-chart/locked/<semester>.json`, its card says "Cadre only"), and changing the cadre password re-locks those too. Adding a new package, or changing one, needs whoever maintains the code (`tools/org-lock.mjs` for a locked one).
- A package can mark the positions cadre changed. A gold **Summary of Changes** button lists each change, what it was and what it is now.

On the Org chart tab, under **Semesters**: **Add a semester** makes a new card. **Edit** changes its name, description and charts (add, remove, reorder, rename the buttons), marks it as the current semester, or removes it. The arrows change the order on the home page (newest shows first). Only one semester that isn't frozen should have a POC Chart or Flip Week; the page warns you if two do.

A position can be **Vacant on the POC chart** (tick it in the position's Edit window). It then shows only during Flip Week, and the person in **Held by** covers its duties.

#### Hide a tool

On the Hub cards tab, press **Hide** on its card. Hide a tool nobody maintains, instead of leaving a broken one up. **Show** brings it back. The arrows change the order.

#### Update a regulation or form

On the Documents tab, press **Edit** on the card. Air Force publications should be outside links to e-Publishing, so cadets always get the current version. Upload a PDF only for detachment or HQ AFROTC files that have no official link. Keep PDFs under 50 MB.

#### The ODT Tool

The ODT Tool page holds everything for each ODT: details and things to know, the itinerary, who's going (cadets and cadre), rooms, vans and documents. Cadets see the next ODT first, and **All ODTs** lists every ODT, upcoming and past. The whole module is locked with the cadet password (the same one as Documents and Policy), so none of it is public.

**First time only:** ODT tab, **Set up**. If the cadet password isn't saved on the admin page yet, type it. This moves the Offutt rooms into the locked file and deletes the old public room list. It also adds the Offutt cadre (Lt Col Cacic, Capt Russell, SSgt Moore, Capt Orr) with rooms of their own, numbers the rooms (cadets 1 to 21 in page order, then Russell 22, Orr 23, Moore 24, Cacic 25) and sets up the four vans. If the ODT Tool was already set up, this happens the first time the ODT tab opens. Check the Rooms and Vans tabs, then publish.

**Add a new ODT**

1. ODT tab, **New ODT**. Enter the name, place, first and last day, the line under the name (for example "Base Visit") and the room sections.
2. Under **Start from**, pick an earlier ODT to copy its roster, rooms and things to know, or start empty.
3. Fill in each tab (below), then publish.

**Fill in an ODT.** Pick it in the **ODT** box, then use the tabs:

- **Details:** Edit details (name, dates, place, note, room sections) and **Things to know** (uniform, what to bring, anything else). **Supporting documents** are PDFs cadets read on the Itinerary & docs tab (open, or download), such as the class excusal letter: **Add a document**, give it a title and an optional note, choose the PDF (up to 25 MB). It is locked with the cadet password when you publish.
- **Itinerary:** upload the itinerary as one PDF (**Choose a PDF**, later **Replace** or **Remove**). Put the hotel address and the meals provided in it. Cadets see it page by page on the Itinerary tab and can open, download or print it.
- **Roster:** who is going, cadets and cadre. **Add cadets** has a search and "All AS 100" style buttons. If someone has a room but isn't on the roster, a button adds them.
- **Rooms:** press **Edit** on a room to change its number, section or cadets. Picking a cadet who is already in another room moves them. Leave cadet 2 empty for a bonus (single) room. The tab warns about roster cadets without a room, anyone in two rooms, and rooms that mix POC with GMC. Cadre always get a room to themselves: **Give the cadre their rooms** puts each cadre member on the roster in a room of their own, in a Cadre section. Gender isn't in the roster, so keep each section to one gender yourself.
- **Vans:** one entry per van with its vehicle (15-passenger ISU van, 11-passenger GOV or other), seats (driver included), driver and relief driver. **Auto-assign riders** keeps the drivers, keeps roommates in the same van (a driver's roommate rides in that van), and spreads everyone else on the roster across the vans by AS class, leaving open seats in each van. Move anyone by hand with the van picker next to their name. The tab warns about people without a van, anyone in two vans, roommates split up and vans over capacity.

**Remove this ODT** deletes it and everything in it. Removing a cadet from the roster keeps them in past ODTs, so history stays complete. Changing the cadet password (History and settings) locks the ODT Tool again with the new password too.

#### Change a site password

Some parts of Storm HQ are locked with their own password: the Documents and Policy plans and OPORDs (the cadet password) and Flight Staff Evaluation. The Cadre Dashboard always uses the admin password, so it changes when the admin password changes.

Save the cadet and Flight Staff Evaluation passwords here once (**Enter it once**). After that, signing in with the cadre password on the home page opens those tools too, and the Admin page stops showing its yellow reminder.

Anyone signed in to the admin page can see and change these passwords without knowing the old one:

1. History and settings tab, under **Site passwords**, press **Show** to see the current password, or **Change** to set a new one (at least 8 characters).
2. Tell everyone who uses it. The old password stops working when the live site updates, about a minute later.

The first time only, a password may say "Not saved here yet". Press **Enter it once** and type the current password. The page checks it and saves it (locked with the admin password), and no one needs to know it after that.

#### Undo a mistake

On the History and settings tab, press **Undo** next to the change. Every file that change touched goes back to how it was before it. The undo is a new change too, so you can undo it as well.

## Keeping it running

| When | What | How |
| --- | --- | --- |
| When the key expires, or at each handover | Replace the GitHub access key | History and settings, then **Replace the GitHub access key**. Make the key the same way as in setup (below). The current key was made without an expiration, so replace it with the new maintainer's own key at handover, then the old owner deletes theirs on GitHub. |
| When someone who knows the password leaves | Change the admin password, and the site passwords they knew | History and settings, then **Change the admin password** and the **Site passwords** |
| At each PCS | Hand over GitHub access | The new maintainer needs edit access to the repository on GitHub (or ownership, if the site moves) |

#### Making a GitHub access key

1. Sign in to GitHub with an account that can edit the Storm HQ repository.
2. Go to Settings, Developer settings, Personal access tokens, **Fine-grained tokens**, then **Generate new token**.
3. Name it "Storm HQ admin". Set an expiration, up to 1 year, and put a reminder on your calendar.
4. Under **Repository access**, choose **Only select repositories** and pick the Storm HQ repository.
5. Under **Permissions**, set **Contents** to **Read and write**. Nothing else is needed.
6. Generate it, copy it and paste it into the admin page.

#### If the admin password is lost

Someone with edit access on GitHub deletes the file `admin/vault.json` in the repository. The admin page then shows the setup screen again, and you set a new password with a new access key.

#### Moving the site to a detachment account

When the repository moves to a new owner (for example a detachment GitHub organization), make a new access key from the new home. Then use **Replace the GitHub access key** and enter the new owner and repository name. The site address changes with the owner, so update any links and QR codes that point to the old one.

### Keeping the editor running

| When | What | How |
| --- | --- | --- |
| When the key expires, or at each handover | Replace the GitHub access key | History and settings, then **Replace the GitHub access key**. Make the key the same way as in setup (below). The current key was made without an expiration, so replace it with the new maintainer's own key at handover, then the old owner deletes theirs on GitHub. |
| When someone who knows the password leaves | Change the admin password, and the site passwords they knew | History and settings, then **Change the admin password** and the **Site passwords** |
| At each PCS | Hand over GitHub access | The new maintainer needs edit access to the repository on GitHub (or ownership, if the site moves) |

#### Making a GitHub access key

1. Sign in to GitHub with an account that can edit the Storm HQ repository.
2. Go to Settings, Developer settings, Personal access tokens, **Fine-grained tokens**, then **Generate new token**.
3. Name it "Storm HQ admin". Set an expiration, up to 1 year, and put a reminder on your calendar.
4. Under **Repository access**, choose **Only select repositories** and pick the Storm HQ repository.
5. Under **Permissions**, set **Contents** to **Read and write**. Nothing else is needed.
6. Generate it, copy it and paste it into the admin page.

#### If the admin password is lost

Someone with edit access on GitHub deletes the file `admin/vault.json` in the repository. The admin page then shows the setup screen again, and you set a new password with a new access key.

#### Moving the site to a detachment account

When the repository moves to a new owner (for example a detachment GitHub organization), make a new access key from the new home. Then use **Replace the GitHub access key** and enter the new owner and repository name. The site address changes with the owner, so update any links and QR codes that point to the old one.

## Where things live

Claude knows all of this from `CLAUDE.md`; it is here for reference.

| File | What it holds |
| --- | --- |
| `data/roster.js` | People, positions and flights |
| `data/charts.js` | Org Chart semesters |
| `data/hub.js` | Hub cards |
| `data/documents.js` | Documents and Policy cards |
| `odt/vault.json`, `odt/files/` | The ODT Tool and its documents, locked with the cadet password |
| `documents/restricted/` | OPLAN, Policy Packet, OPORDs, locked with the cadet password |
| `org-chart/packages/`, `org-chart/locked/` | Proposed wing packages (public, or locked with the cadre password) |
| `org-chart/photos/`, `whos-that-cadet/photos/` | Photos, named by each person's key |
| `admin/vault.json` | The backup editor's GitHub key and the saved site passwords, locked with the admin password |
| `CLAUDE.md` | Full technical notes for the whole site, and the rules Claude follows |
