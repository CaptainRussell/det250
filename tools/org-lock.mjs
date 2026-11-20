// Locks (or opens) a cadre-only Org Chart semester: org-chart/locked/<semester id>.json.
// Same layout as tools/encrypt.mjs (PBKDF2-SHA256 310k -> AES-256-GCM), sealed with the cadre password.
//   node tools/org-lock.mjs lock   <password> <plain.json OUTSIDE the repo> org-chart/locked/<id>.json
//   node tools/org-lock.mjs unlock <password> org-chart/locked/<id>.json <plain.json OUTSIDE the repo>
// Plain layout: {v, term, proposals:[{id, name, source, seats:[{id, des, title, last, rank, parent, changed?, note?}]}],
//   duties:{<package id>:{<seat key>:{heading, text, pages}}}, changes:{<package id>:[{title, before, after, seats}]}}
// Changing the cadre password on the admin page re-locks these files too. Never commit the plain file.
import fs from "node:fs";
const [,, mode, password, inFile, outFile] = process.argv;
if (!["lock", "unlock"].includes(mode) || !password || !inFile || !outFile){ console.error("usage: node tools/org-lock.mjs lock|unlock <password> <in> <out>"); process.exit(1); }
const enc = new TextEncoder(), b64 = u => Buffer.from(u).toString("base64"), unb64 = s => new Uint8Array(Buffer.from(s, "base64"));
const derive = async (salt, iter, use) => crypto.subtle.deriveKey({name:"PBKDF2", salt, iterations:iter, hash:"SHA-256"},
  await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]), {name:"AES-GCM", length:256}, false, [use]);
if (mode === "lock"){
  const plain = enc.encode(JSON.stringify(JSON.parse(fs.readFileSync(inFile, "utf8"))));
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM", iv}, await derive(salt, 310000, "encrypt"), plain));
  fs.writeFileSync(outFile, JSON.stringify({v:1, iter:310000, salt:b64(salt), iv:b64(iv), data:b64(ct)}, null, 1) + "\n");
} else {
  const v = JSON.parse(fs.readFileSync(inFile, "utf8"));
  const pt = await crypto.subtle.decrypt({name:"AES-GCM", iv:unb64(v.iv)}, await derive(unb64(v.salt), v.iter, "decrypt"), unb64(v.data));
  fs.writeFileSync(outFile, JSON.stringify(JSON.parse(new TextDecoder().decode(pt)), null, 1));
}
console.log("wrote", outFile);
