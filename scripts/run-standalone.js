const path = require("node:path");

// Container hosts (GoDaddy, cPanel, etc.) inject PORT — never hard-code 3002 in production.
process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";
if (!process.env.PORT) {
  process.env.PORT = "3000";
}

require(path.join(process.cwd(), ".next", "standalone", "server.js"));