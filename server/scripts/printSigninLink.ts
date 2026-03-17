/**
 * Imprime el enlace de inicio de sesión por email para un usuario existente.
 * Uso: node build/server/scripts/printSigninLink.js email@ejemplo.com
 */
import "./bootstrap";
import env from "@server/env";
import { User } from "@server/models";

const email = process.argv[2];

async function main() {
  if (!email) {
    console.error("Uso: node build/server/scripts/printSigninLink.js <email>");
    process.exit(1);
  }

  const user = await User.findOne({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    console.error(`No existe ningún usuario con el email: ${email}`);
    process.exit(1);
  }

  const link = `${env.URL}/auth/email.callback?token=${user.getEmailSigninToken()}&client=web`;
  console.log("\nEnlace de inicio de sesión (ábrelo en el navegador):\n");
  console.log(link);
  console.log("");
  process.exit(0);
}

main();
