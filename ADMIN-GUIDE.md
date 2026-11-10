# Storm HQ admin guide

This guide is for the cadre member who keeps Storm HQ up to date. You don't need to know how to code. Almost everything is done on the **Cadre Admin** page.

- Live site: https://captainrussell.github.io/det250/
- Admin page: https://captainrussell.github.io/det250/admin/ (also linked as "Cadre admin" at the bottom of the home page)

## How it works

Storm HQ is a set of web pages stored on GitHub. GitHub Pages turns that storage into the live site. The admin page edits four data files and the photos, then saves them to GitHub as one change. The live site updates about a minute later.

| What you edit | Where it shows up |
| --- | --- |
| People (the roster) | Org Chart, Know Your Wing, the instructor tool preset groups, Peer Feedback |
| Org chart positions | Org Chart (POC chart and Flip Week), Know Your Wing ranks and positions |
| Hub cards | The Storm HQ home page |
| Documents | Documents and Policy, and every tool that cites a regulation |
| Rooms | ODT Room Assignments (every ODT, current and past) |

Every change is kept in the history, so nothing you do is permanent. You can undo any change from the **History and settings** tab.

## Signing in

1. Open the admin page and enter the admin password.
2. Make your edits on the tabs. A yellow bar at the bottom lists what you changed.
3. Press **Publish to the live site**. Or press **Discard** to throw the changes away.
4. Check the live site after about a minute.

Give the admin password only to cadre who maintain Storm HQ. Change it whenever one of them leaves (History and settings, then **Change the admin password**).

## Common jobs

### Start a new semester

Do this each August and January, after the new cadet wing is set.

1. **People tab:** set **Semester shown on the tools** (for example "Spring 2027").
2. **People tab:** add new cadets, remove cadets who left, and fix classes (AS 100 to AS 200 and so on). Set each cadet's flight.
3. **Org chart tab:** put the new cadet staff in each position, with ranks. Set the Flip Week holder for each position, or leave it hidden.
4. **Hub cards tab:** update any card that names a semester or a due date (for example the Org Chart and Peer Feedback cards).
5. **Documents tab:** check the links still work. Upload or link any new instruction.
6. Publish, then look over the Org Chart and Know Your Wing on the live site.
7. Ask whoever runs Peer Feedback to rebuild the cadet codes (see "What the admin page doesn't do").

### Add a cadet

1. People tab, **Add a person**.
2. Enter last name, first name, middle initial and class. Pick their flight.
3. **Choose a photo**, then drag it and use the zoom slider so the face fills the circle.
4. Press **Add**, then publish.

### Change a photo

Open the person on the People tab, choose a new photo, line it up, save and publish. The page saves a small copy for the Org Chart and a larger copy for Know Your Wing.

### Remove a cadet

Open the person and press **Remove from roster**. If they still hold a position, the page tells you which one. Put someone else in that position on the Org chart tab first.

### Change who holds a position

On the Org chart tab, press **Edit** on the position. Pick who holds it, their rank, who holds it during Flip Week, and who it reports to. **Add a position** creates a new one. Flip Week ranks are set automatically.

### Hide a tool

On the Hub cards tab, press **Hide** on its card. Hide a tool nobody maintains, instead of leaving a broken one up. **Show** brings it back. The arrows change the order.

### Update a regulation or form

On the Documents tab, press **Edit** on the card. Air Force publications should be outside links to e-Publishing, so cadets always get the current version. Upload a PDF only for detachment or HQ AFROTC files that have no official link. Keep PDFs under 50 MB.

### ODT room assignments

The ODT Room Assignments page keeps one room assignment per ODT. Cadets see the next ODT first, and the **All assignments** tab lists every ODT, upcoming and past. Each room shows the cadets' Org Chart photos, ranks and positions. Those come from the roster, so you only pick who is in each room.

**Add a new ODT**

1. Rooms tab, **New assignment**. Enter the name, place, first and last day, and the line under the name (for example "Same Gender Mandatory.").
2. Under **Start from**, pick an earlier ODT to copy its pairs and then edit them, or start with no rooms.
3. Press **Add**, change the rooms (below), then publish.

**Change rooms**

1. Pick the ODT in the **Assignment** box. **Edit details** changes its name, dates, place, note or sections. **Remove** deletes it and its rooms.
2. Press **Edit** on a room to change its number, its section (for example "Women" or "Men · POC") or who is in it. Picking a cadet who is already in another room of that ODT moves them. Leave cadet 2 empty for a bonus (single) room.
3. **Add a room** for a new one. A room left with nobody in it is removed. The arrows move a room up or down within its section.
4. The tab warns about anyone who no longer has a room, anyone in two rooms, and rooms that mix POC with GMC. Gender isn't in the roster, so keep each section to one gender yourself.
5. Publish. Cadets can search for their name on the page, and **Print** makes a two-page paper copy of the ODT on screen.

Removing a cadet from the roster keeps them in past ODTs (their name is saved), so history stays complete.

### Change a site password

Some parts of Storm HQ are locked with their own password: the Documents and Policy plans and OPORDs (the cadet password) and Flight Staff Evaluation. The Cadre Dashboard always uses the admin password, so it changes when the admin password changes.

Anyone signed in to the admin page can see and change these passwords without knowing the old one:

1. History and settings tab, under **Site passwords**, press **Show** to see the current password, or **Change** to set a new one (at least 8 characters).
2. Tell everyone who uses it. The old password stops working when the live site updates, about a minute later.

The first time only, a password may say "Not saved here yet". Press **Enter it once** and type the current password. The page checks it and saves it (locked with the admin password), and no one needs to know it after that.

### Undo a mistake

On the History and settings tab, press **Undo** next to the change. Every file that change touched goes back to how it was before it. The undo is a new change too, so you can undo it as well.

## Keeping it running

| When | What | How |
| --- | --- | --- |
| When the key expires, or at each handover | Replace the GitHub access key | History and settings, then **Replace the GitHub access key**. Make the key the same way as in setup (below). The current key was made without an expiration, so replace it with the new maintainer's own key at handover, then the old owner deletes theirs on GitHub. |
| When someone who knows the password leaves | Change the admin password, and the site passwords they knew | History and settings, then **Change the admin password** and the **Site passwords** |
| At each PCS | Hand over GitHub access | The new maintainer needs edit access to the repository on GitHub (or ownership, if the site moves) |

### Making a GitHub access key

1. Sign in to GitHub with an account that can edit the Storm HQ repository.
2. Go to Settings, Developer settings, Personal access tokens, **Fine-grained tokens**, then **Generate new token**.
3. Name it "Storm HQ admin". Set an expiration, up to 1 year, and put a reminder on your calendar.
4. Under **Repository access**, choose **Only select repositories** and pick the Storm HQ repository.
5. Under **Permissions**, set **Contents** to **Read and write**. Nothing else is needed.
6. Generate it, copy it and paste it into the admin page.

### If the admin password is lost

Someone with edit access on GitHub deletes the file `admin/vault.json` in the repository. The admin page then shows the setup screen again, and you set a new password with a new access key.

### Moving the site to a detachment account

When the repository moves to a new owner (for example a detachment GitHub organization), make a new access key from the new home. Then use **Replace the GitHub access key** and enter the new owner and repository name. The site address changes with the owner, so update any links and QR codes that point to the old one.

## What the admin page doesn't do

These still need someone comfortable with the technical side, or Claude Code working in the repository. `CLAUDE.md` in the repository has the details for each one.

- **Peer Feedback codes and back end.** After a roster change, rebuild the codes and the Apps Script with `tools/build-peer-feedback.mjs`, paste the script into the Peer Feedback sheet, and redeploy. Existing cadets keep their codes.
- **Flight Staff Evaluation roster.** It is inside the password-encrypted page, so it is edited outside the repository and then locked again with `tools/encrypt.mjs`.
- **Adding or replacing locked plans and OPORDs.** These are encrypted with `tools/encrypt-files.mjs`. (Changing their password is on the admin page.)
- **Cadre Dashboard connection settings,** built with `tools/build-cadre-vault.mjs`. (Changing its password is on the admin page.)
- **Position descriptions** in the Org Chart drawer (`org-chart/position-descriptions.js`), which keep their OPLAN citations.
- **New tools,** new hub sections and page design.

## Where things live

| File | What it holds |
| --- | --- |
| `data/roster.js` | People, positions and flights |
| `data/hub.js` | Hub cards |
| `data/documents.js` | Documents and Policy cards |
| `data/rooms.js` | ODT room assignments, one entry per ODT plus its rooms |
| `org-chart/photos/` | 240 px photos, named by each person's key |
| `whos-that-cadet/photos/` | 600 px photos for Know Your Wing |
| `admin/vault.json` | The GitHub access key and the saved site passwords, locked with the admin password |
| `CLAUDE.md` | Full technical notes for the whole site |
