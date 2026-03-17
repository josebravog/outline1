/**
 * Abre la app en el navegador (desarrollo local).
 * Ejecutar después de "yarn dev" o usar "yarn dev:open".
 */
const { execSync } = require("child_process");
const url = process.env.URL || "http://localhost:3000";

try {
  if (process.platform === "win32") {
    execSync(`start "" "${url}"`, { stdio: "ignore" });
  } else if (process.platform === "darwin") {
    execSync(`open "${url}"`, { stdio: "ignore" });
  } else {
    execSync(`xdg-open "${url}"`, { stdio: "ignore" });
  }
  console.log("Abriendo", url, "en el navegador.");
} catch (e) {
  console.log("Abre manualmente en el navegador:", url);
}
