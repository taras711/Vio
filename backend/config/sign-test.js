// backend/config/sign-test.js
const fs = require("fs");
const crypto = require("crypto");

// 1) Načti privátní klíč (tvůj vlastní soubor)
const privateKey = fs.readFileSync("backend/config/keys/license_private.pem", "utf8");

// 2) Načti unsigned JSON (bez signature)
const data = JSON.parse(fs.readFileSync("backend/config/license-unsigned.json", "utf8"));

// 3) Canonical JSON – stabilní pořadí klíčů
const canonical = JSON.stringify(data, Object.keys(data).sort());

// 4) Podepiš canonical JSON
const sign = crypto.createSign("RSA-SHA256");
sign.update(canonical);
sign.end();

const signature = sign.sign(privateKey, "base64");

// 5) Vypiš podpis
console.log("NEW SIGNATURE:", signature);