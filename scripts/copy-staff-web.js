const fs = require("fs");
const path = require("path");

const source = path.join(__dirname, "..", "web");
const destination = path.join(__dirname, "..", "dist", "staff");

fs.rmSync(destination, { recursive: true, force: true });
fs.cpSync(source, destination, { recursive: true });
console.log(`Copied staff web app to ${destination}`);
