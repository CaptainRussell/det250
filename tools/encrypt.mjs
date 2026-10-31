// Encrypts a page with a password: PBKDF2-SHA256 (310k) -> AES-256-GCM.
import fs from "node:fs";
const [,, inFile, outFile, password, templateFile] = process.argv;
const enc = new TextEncoder();
const plain = enc.encode(fs.readFileSync(inFile, "utf8"));
const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
const base = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
const key = await crypto.subtle.deriveKey({name:"PBKDF2", salt, iterations:310000, hash:"SHA-256"}, base, {name:"AES-GCM", length:256}, false, ["encrypt"]);
const ct = new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM", iv}, key, plain));
const b64 = u => Buffer.from(u).toString("base64");
const payload = JSON.stringify({v:1, iter:310000, salt:b64(salt), iv:b64(iv), data:b64(ct)});
const tpl = fs.readFileSync(templateFile, "utf8");
fs.writeFileSync(outFile, tpl.replace("/*__PAYLOAD__*/null", payload));
console.log("wrote", outFile, (fs.statSync(outFile).size/1024|0) + " KB");
