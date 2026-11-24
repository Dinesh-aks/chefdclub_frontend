const path = require("node:path");

require("./godaddy-env.js");
require(path.join(process.cwd(), ".next", "standalone", "server.js"));