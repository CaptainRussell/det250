// Financial Readiness lock (Captain Russell, 25 Nov 2026: cadets can't pre-watch the lesson).
// The presenter deck (slides/deck.js) and the chapter 1, 2 and 4 scenes are sealed into ONE file,
// financial-readiness/slides/deck.lock.json, with PBKDF2-SHA256 (310k) + AES-256-GCM, the same
// layout as tools/encrypt.mjs. slides/lock.js opens it in the browser. Chapter 3 (lessons/c3-brs/scene.js)
// stays public because the phone page (join/) draws its charts.
//
// Keep the plain files OUTSIDE the repo, in one folder with the same names as the list below.
//   seal:   node tools/fr-lock.mjs seal   <password> <plain folder>
//   unpack: node tools/fr-lock.mjs unpack <password> <plain folder>   (writes the plain files back out)
// Never commit the plain files or the password.
import fs from "node:fs";
import path from "node:path";

const FILES = ["les-shot.js", "c1-from-minus-20k.scene.js", "c2-first-les.scene.js", "c4-money-calls.scene.js", "deck.js"];
const OUT = new URL("../financial-readiness/slides/deck.lock.json", import.meta.url);
const MARK = (name) => `\n//@@file ${name}\n`;
const [,, mode, password, dir] = process.argv;
if (!["seal", "unpack"].includes(mode) || !password || !dir) {
  console.error("usage: node tools/fr-lock.mjs seal|unpack <password> <plain folder>"); process.exit(1);
}
const enc = new TextEncoder();
const b64 = (u) => Buffer.from(u).toString("base64"), unb64 = (s) => new Uint8Array(Buffer.from(s, "base64"));
async function keyFor(salt, iter, use) {
  const base = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: iter, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, [use]);
}

if (mode === "seal") {
  // each file is run in order; the marks let unpack split them again
  const plain = FILES.map((f) => MARK(f) + fs.readFileSync(path.join(dir, f), "utf8")).join("");
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await keyFor(salt, 310000, "encrypt"), enc.encode(plain)));
  fs.writeFileSync(OUT, JSON.stringify({ v: 1, iter: 310000, salt: b64(salt), iv: b64(iv), data: b64(ct) }) + "\n");
  console.log("sealed", FILES.length, "files into", OUT.pathname, (fs.statSync(OUT).size / 1024 | 0) + " KB");
} else {
  const V = JSON.parse(fs.readFileSync(OUT, "utf8"));
  const plain = new TextDecoder().decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(V.iv) }, await keyFor(unb64(V.salt), V.iter, "decrypt"), unb64(V.data)));
  fs.mkdirSync(dir, { recursive: true });
  plain.split(/\n\/\/@@file /).slice(1).forEach((part) => {
    const nl = part.indexOf("\n"), name = part.slice(0, nl);
    fs.writeFileSync(path.join(dir, name), part.slice(nl + 1));
    console.log("wrote", path.join(dir, name));
  });
}
