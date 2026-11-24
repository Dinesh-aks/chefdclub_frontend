"use strict";

// Use the port assigned by GoDaddy.
const port = process.env.PORT || 3000;

process.env.PORT = String(port);
process.env.HOSTNAME = "0.0.0.0";
