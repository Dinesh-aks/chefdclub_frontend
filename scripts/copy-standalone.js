
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

console.log("Standalone build prepared successfully!");
