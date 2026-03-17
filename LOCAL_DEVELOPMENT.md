# Desarrollo local de Outline

Pasos para correr Outline en tu máquina y verlo en el navegador en **http://localhost:3000**.

## Requisitos

- **Node.js** 14 o superior (recomendado LTS 18 o 20)
- **Yarn** (`npm install -g yarn`)
- **Docker Desktop** (para PostgreSQL, Redis y S3 local). Debe estar **abierto y en ejecución** antes de `docker-compose up -d`.  
  Si no usas Docker, instala PostgreSQL y Redis en tu sistema y crea la base `outline` y el usuario según `.env`.

## 1. Servicios con Docker

Abre **Docker Desktop** y espera a que esté en marcha. Luego, en la raíz del repo:

```bash
docker-compose up -d
```

Esto levanta:

- PostgreSQL en `localhost:5432` (usuario `user`, contraseña `pass`, base `outline`)
- Redis en `localhost:6379`
- Fake S3 en `localhost:4569` (almacenamiento local)

## 2. Dependencias de Node

```bash
yarn install
```

## 3. Variables de entorno

Ya existe un `.env` configurado para desarrollo local (URL `http://localhost:3000`). En Windows se usa **127.0.0.1** para Postgres/Redis (evita que `localhost` resuelva a IPv6 `::1`). Si quieres cambiar algo, edita `.env`.

## 4. Base de datos

Crear la base (si no existe) y aplicar migraciones:

```bash
yarn db:create
yarn db:migrate
```

(Si `db:create` falla porque la base ya existe, ignora el error y sigue con `db:migrate`.)

## 5. Build y arranque en modo desarrollo

Atajo recomendado (levanta Docker, migra, compila server + i18n):

```bash
yarn dev:setup
```

Primera vez (build completo del server y del front):

```bash
yarn build:server
yarn build:i18n
yarn dev
```

O en un solo paso (limpia, construye webpack, i18n y server y luego arranca):

```bash
yarn build
yarn dev
```

**Abrir en el navegador:** la app **no abre el navegador sola**. Haz una de estas dos cosas:

- Abre el navegador manualmente y ve a **http://localhost:3000**
- O en otra terminal ejecuta `yarn open` para que se abra solo

La primera carga puede tardar 1–2 minutos mientras webpack compila. Si ves una pantalla de login sin opciones para iniciar sesión, ve a **http://localhost:3000/create** para crear tu primer workspace (luego podrás configurar Google/Slack en `.env` o usar invitación por email si configuras SMTP).

Si usas login por email en desarrollo **no llega a Gmail**: el backend imprime el enlace en la consola. También puedes generar uno con:

```bash
yarn login:link tu@email.com
```

En modo `dev`, el front se sirve con recarga en caliente (webpack dev middleware). Para reiniciar solo el server al cambiar código de `server/` o `shared/`:

```bash
yarn dev:watch
```

## Resumen de comandos

| Comando           | Descripción                          |
|-------------------|--------------------------------------|
| `docker-compose up -d` | Levanta Postgres, Redis y S3        |
| `yarn install`    | Instala dependencias                 |
| `yarn db:create`  | Crea la base de datos                |
| `yarn db:migrate` | Aplica migraciones                   |
| `yarn build`      | Build completo (webpack + i18n + server) |
| `yarn dev`        | Arranca la app en desarrollo         |
| `yarn dev:watch`  | Arranca con reinicio al cambiar server/shared |

## Autenticación en desarrollo

El `.env` de desarrollo no tiene Google/Slack/Microsoft configurados. Puedes:

- Añadir credenciales OAuth en `.env` (Google, Slack o Azure) para iniciar sesión con esos proveedores, o
- Usar el flujo de invitación por email si tienes SMTP configurado (opcional).

## Problemas frecuentes

- **"Cannot connect to database"**: asegúrate de que Docker esté en marcha y `docker-compose up -d` se haya ejecutado.
- **"Redis connection"**: comprueba que el contenedor Redis esté activo en el puerto 6379.
- **Subida de archivos/avatares**: el fake-s3 en Docker debe estar levantado; la primera subida puede crear el bucket `outline` automáticamente según la imagen.

## Deploy en Railway (web + worker)

Este repo incluye `nixpacks.toml` para que Railway:

- Use **Node 16**
- Ejecute `yarn build` en el build step
- Arranque por defecto con `yarn start:web`

Para tener **web** y **worker** como en `Procfile`:

- **Servicio web**: Start Command `yarn start:web`
- **Servicio worker**: Start Command `yarn start:worker`

Variables mínimas requeridas (además de las que te da Railway para Postgres/Redis):

- `SECRET_KEY` (64 hex, `openssl rand -hex 32`)
- `UTILS_SECRET` (64 hex)
- `URL` (tu dominio público, ej: `https://tu-app.up.railway.app`)
- `DATABASE_URL` (desde el plugin Postgres)
- `REDIS_URL` (desde el plugin Redis)
