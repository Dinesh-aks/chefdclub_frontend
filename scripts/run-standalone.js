const path = require("node:path");

// Container hosts (e.g. GoDaddy) inject PORT; bind on all interfaces unless HOSTNAME is set.
process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";

require(path.join(process.cwd(), ".next", "standalone", "server.js"));