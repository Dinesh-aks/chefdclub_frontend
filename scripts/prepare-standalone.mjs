

import fs from "node:fs";
import path from "node:path";

const standaloneDir = ".next/standalone";

// Copy Next.js static assets
const staticSource = ".next/static";
const staticDestination = path.join(
  standaloneDir,
  ".next/static"
);

if (fs.existsSync(staticSource)) {
  fs.cpSync(staticSource, staticDestination, {
    recursive: true,
    force: true,
  });
}

// Copy public assets
if (fs.existsSync("public")) {
  fs.cpSync("public", path.join(standaloneDir, "public"), {
    recursive: true,
    force: true,
  });
}

console.log("Standalone deployment prepared successfully.");
