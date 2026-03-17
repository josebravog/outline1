/**
 * Añade un usuario al equipo existente (o usa el existente) e imprime el enlace de inicio de sesión.
 * Uso: node build/server/scripts/addUserAndPrintLink.js email@ejemplo.com
 */
import "./bootstrap";
import env from "@server/env";
import { Team, User } from "@server/models";

const email = process.argv[2];

async function main() {
  if (!email) {
    console.error(
      "Uso: node build/server/scripts/addUserAndPrintLink.js <email>"
    );
    process.exit(1);
  }

  const team = await Team.findOne();
  if (!team) {
    console.error("No hay ningún equipo. Ejecuta antes: yarn seed tu@email.com");
    process.exit(1);
  }

  let user = await User.findOne({
    where: { email: email.toLowerCase(), teamId: team.id },
  });

  if (!user) {
    user = await User.create({
      teamId: team.id,
      email: email.toLowerCase(),
      name: email.split("@")[0],
      isAdmin: true,
      isViewer: false,
    });
    console.log("Usuario creado para", email);
  }

  const link = `${env.URL}/auth/email.callback?token=${user.getEmailSigninToken()}&client=web`;
  console.log("\nEnlace de inicio de sesión (ábrelo en el navegador):\n");
  console.log(link);
  console.log("");
  process.exit(0);
}

main();
