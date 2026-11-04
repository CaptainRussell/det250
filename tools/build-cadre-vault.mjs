// Encrypts the Cadre page's connection settings (Apps Script URLs + read tokens).
//   node tools/build-cadre-vault.mjs <cadre password> <config.json outside the repo>
// config.json: {"peer":{"url":"https://script.google.com/.../exec","token":"..."},
//               "fse":{"url":"https://script.google.com/.../exec","token":"..."}}   (fse optional)
// Writes cadre/vault.json. PBKDF2-SHA256 (310k) -> AES-256-GCM, the same as tools/encrypt.mjs.
// The page code is public; only these settings are secret. Never commit the password or config.json.
import fs from "node:fs";
const [,, password, cfgFile] = process.argv;
if (!password || !cfgFile) { console.error("usage: node tools/build-cadre-vault.mjs <password> <config.json>"); process.exit(1); }
const cfg = JSON.parse(fs.readFileSync(cfgFile, "utf8"));
const enc = new TextEncoder();
const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
const base = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 310000, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(JSON.stringify(cfg))));
const b64 = u => Buffer.from(u).toString("base64");
fs.writeFileSync("cadre/vault.json", JSON.stringify({ v: 1, iter: 310000, salt: b64(salt), iv: b64(iv), data: b64(ct) }, null, 1) + "\n");
console.log("wrote cadre/vault.json for:", Object.keys(cfg).join(", "));
