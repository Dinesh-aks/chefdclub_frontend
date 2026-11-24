const fs = require("node:fs");
const path = require("node:path");

const standaloneDir = path.join(process.cwd(), ".next", "standalone");

const required = [
  path.join(standaloneDir, "server.js"),
  path.join(standaloneDir, "godaddy-env.js"),
  path.join(standaloneDir, "node_modules", "next", "dist", "pages", "_error.js"),
  path.join(standaloneDir, ".next", "static"),
  path.join(standaloneDir, "public"),
];

for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error(`Standalone verify failed: missing ${path.relative(process.cwd(), file)}`);
    process.exit(1);
  }
}

console.log("Standalone verify OK (server, godaddy-env, next/pages/_error, static, public).");