"use strict";

// GoDaddy port checks look for process.env.PORT (see their hosting docs).
const port = process.env.PORT || 3000;
process.env.PORT = String(port);
process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";