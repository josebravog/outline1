/**
 * Copy i18n locales to build. Cross-platform (Windows + Unix).
 */
const path = require("path");
const fs = require("fs");

const root = path.join(__dirname, "..");
const src = path.join(root, "shared/i18n/locales");
const dest = path.join(root, "build/shared/i18n/locales");

function copyRecursive(srcDir, destDir) {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  for (const name of fs.readdirSync(srcDir)) {
    const srcPath = path.join(srcDir, name);
    const destPath = path.join(destDir, name);
    if (fs.statSync(srcPath).isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (!fs.existsSync(src)) {
  console.warn("shared/i18n/locales not found, skipping copy:i18n");
  process.exit(0);
}
copyRecursive(src, dest);
console.log("i18n locales copied to build/shared/i18n/");
