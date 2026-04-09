import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";


console.log(__dirname); // funguje

console.log("Server2 starting...");

try {
  const data = fs.readFileSync(path.join(__dirname, "../package.json"), "utf8");

  console.log("File read OK, length:", data.length);
} catch (err) {
  console.error("File read FAILED:", err);
}

console.log("Done.");
