
const fs = require("node:fs");
const path = require("node:path");

const standaloneDir = path.join(".next", "standalone");

function copyDirectory(source, destination) {
  if (!fs.existsSync(source)) {
    console.log(`Skipping: ${source} not found`);
    return;
  }

  fs.mkdirSync(destination, { recursive: true });

  fs.cpSync(source, destination, {
    recursive: true,
    force: true,
  });

  console.log(`Copied ${source} -> ${destination}`);
}

// Verify standalone build
if (!fs.existsSync(path.join(standaloneDir, "server.js"))) {
  throw new Error("Standalone server.js not found!");
}

// Copy Next.js static assets
copyDirectory(
  path.join(".next", "static"),
  path.join(standaloneDir, ".next", "static")
);

// Copy public assets
copyDirectory(
  "public",
  path.join(standaloneDir, "public")
);

// GoDaddy dependency checks expect next/dist/pages/_error in standalone node_modules.
const nextPagesSrc = path.join("node_modules", "next", "dist", "pages");
const nextPagesDest = path.join(standaloneDir, "node_modules", "next", "dist", "pages");
copyDirectory(nextPagesSrc, nextPagesDest);

const godaddyEnvSrc = path.join("scripts", "godaddy-env.js");
const godaddyEnvDest = path.join(standaloneDir, "godaddy-env.js");
fs.copyFileSync(godaddyEnvSrc, godaddyEnvDest);

const pkgPath = path.join(standaloneDir, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
pkg.engines = { ...pkg.engines, node: ">=20" };
pkg.scripts = {
  build: "echo build",
  start: "node -r ./godaddy-env.js server.js",
};
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

require("./verify-standalone.js");
