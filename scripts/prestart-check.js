const fs = require("node:fs");
const path = require("node:path");

const serverPath = path.join(process.cwd(), ".next", "standalone", "server.js");

if (!fs.existsSync(serverPath)) {
  console.error(
    "Missing .next/standalone/server.js — run `npm run build` before `npm run start`.",
  );
  process.exit(1);
}