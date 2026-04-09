// backend/config/fp.js
const os = require("os");
const crypto = require("crypto");

const hostname = os.hostname();
const fp = crypto.createHash("sha256").update(hostname).digest("hex");

console.log("Hostname:", hostname);
console.log("Fingerprint:", fp);