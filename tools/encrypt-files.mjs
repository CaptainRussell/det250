// Encrypts restricted documents (PDFs) for the Documents and Policy tool.
//
//   node tools/encrypt-files.mjs <password> <list.json> <out-dir>
//
// list.json (keep it OUTSIDE the repo, next to the plain PDFs):
//   [{"id":"oplan","group":"plans","title":"Fall 2026 OPLAN","src":"C:/.../OPLAN.pdf"}, ...]
//   group is "plans" or "opords". src paths are relative to list.json.
//
// Writes <out-dir>/<id>.bin (12-byte IV + AES-256-GCM ciphertext) for each file
// and <out-dir>/vault.json (salt, a password check, and the public file list).
// One key, derived once from the password with PBKDF2-SHA256 (310k), unlocks
// every file, so the page only pays the PBKDF2 cost once. Every run makes a new
// salt, so rebuild ALL files together (a password change or one new OPORD
// means rerunning the whole list). Never commit the plain PDFs or list.json.
import fs from "node:fs";
import path from "node:path";

const [,, password, listFile, outDir] = process.argv;
if(!password || !listFile || !outDir){
  console.error("usage: node tools/encrypt-files.mjs <password> <list.json> <out-dir>");
  process.exit(1);
}
const ITER = 310000;
const enc = new TextEncoder();
const list = JSON.parse(fs.readFileSync(listFile, "utf8"));
const base = path.dirname(path.resolve(listFile));
const salt = crypto.getRandomValues(new Uint8Array(16));
const pbk = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
const key = await crypto.subtle.deriveKey({name:"PBKDF2", salt, iterations:ITER, hash:"SHA-256"}, pbk, {name:"AES-GCM", length:256}, false, ["encrypt"]);
const b64 = u => Buffer.from(u).toString("base64");

async function seal(bytes){
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM", iv}, key, bytes));
  const out = new Uint8Array(12 + ct.length); out.set(iv); out.set(ct, 12);
  return out;
}

fs.mkdirSync(outDir, {recursive:true});
for(const f of fs.readdirSync(outDir)) if(f.endsWith(".bin")) fs.rmSync(path.join(outDir, f));

const files = [];
for(const item of list){
  if(!/^[a-z0-9-]+$/.test(item.id)) throw new Error("bad id: " + item.id);
  const plain = fs.readFileSync(path.resolve(base, item.src));
  if(plain.subarray(0, 5).toString() !== "%PDF-") throw new Error("not a PDF: " + item.src);
  const sealed = await seal(plain);
  fs.writeFileSync(path.join(outDir, item.id + ".bin"), sealed);
  files.push({id:item.id, group:item.group, title:item.title, size:plain.length});
  console.log("sealed", item.id, (plain.length/1024|0) + " KB");
}
const check = await seal(enc.encode("storm-hq-vault-ok"));
fs.writeFileSync(path.join(outDir, "vault.json"),
  JSON.stringify({v:1, iter:ITER, salt:b64(salt), check:b64(check), files}, null, 1) + "\n");
console.log("wrote", path.join(outDir, "vault.json"), files.length, "files");
