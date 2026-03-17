/**
 * Build server and shared for development/production.
 * Cross-platform (Windows + Unix). Replaces build.sh on Windows.
 */
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..");

function run(cmd, opts = {}) {
  execSync(cmd, { stdio: "inherit", cwd: root, ...opts });
}

function copy(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(path.join(root, src), path.join(root, dest));
}

// 1. Babel server and shared (use npx so local @babel/cli is found)
run("npx babel --extensions .ts,.tsx --quiet -d ./build/server ./server");
run("npx babel --extensions .ts,.tsx --quiet -d ./build/shared ./shared");

// 2. Copy static files
copy("server/collaboration/Procfile", "build/server/collaboration/Procfile");
copy("package.json", "build/package.json");
copy("server/static/error.dev.html", "build/server/error.dev.html");
copy("server/static/error.prod.html", "build/server/error.prod.html");

// Webpack config is required from project root (see server/services/web.ts)

console.log("Server build done.");
