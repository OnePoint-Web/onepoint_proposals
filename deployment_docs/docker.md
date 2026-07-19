# Docker

## Overview

This project uses Docker Compose to orchestrate multiple services.

Current services:

- Proposal Portal (Next.js)
- Client Portal (Next.js)
- MariaDB

Each application runs in its own container while sharing a single Docker network and MariaDB instance.

---

## Directory Structure

```text
/apps
├── client_portal/
│   ├── Dockerfile
│   └── .dockerignore
│
├── onepoint_proposals/
│   ├── Dockerfile
│   └── .dockerignore
│
├── compose.yaml
└── .env
```

---

## Docker Images

| Service | Build Source |
|----------|--------------|
| Proposal Portal | ./onepoint_proposals |
| Client Portal | ./client_portal |
| MariaDB | mariadb:11 |

---

## Docker Compose

The compose file manages:

- container creation
- networking
- persistent volumes
- environment variables
- restart policies

Applications are started using:

```bash
docker compose up --build -d
```

---

## Docker Network

Both applications communicate with MariaDB through the Docker network.

```
proposal-network
```

Database hostname:

```
mysql
```

Example:

```
DATABASE_URL=mysql://user:password@mysql:3306/database
```

---

## Volumes

MariaDB data is stored in:

```
onepoint_proposals_mysql_data
```

This volume persists database data even when containers are recreated.

---

## Ports

| Service | Host | Container |
|---------|-----:|----------:|
| Proposal Portal | 3000 | 3000 |
| Client Portal | 3001 | 3000 |

Applications always listen on port **3000** inside the container.

Docker maps different host ports to avoid conflicts.

---

## Environment Variables

Docker Compose reads variables from:

```
/apps/.env
```

Application-specific variables are loaded using:

```yaml
env_file:
```

Each application maintains its own `.env`.

---

## Multi-stage Docker Builds

Both Next.js applications use multi-stage builds:

1. Install dependencies
2. Build the application
3. Create a minimal production image

Benefits:

- Smaller images
- Faster deployments
- Development dependencies are excluded from production

---

## Common Commands

Build and start:

```bash
docker compose up --build -d
```

**When `--build` is required vs. not:**

| Change | Command |
|---|---|
| Any source file, `next.config.*`, `schema.prisma`, `package.json` | `docker compose up --build -d <service>` |
| A variable in `<app>/.env` only | `docker compose up -d <service>` (no `--build`) |

`.env` files are listed in `.dockerignore`, so they're never baked into the image at build time — they're injected fresh at container start via `env_file` in `compose.yaml`. Rebuilding after an env-only change isn't harmful, just unnecessary. Conversely, `docker compose up -d` **without** `--build` after a code change will keep the old code running silently — the container looks "updated" (new container ID, recent start time) but is still serving the previous image. See `troubleshooting.md` → "Bug fix works locally but not on the live site."

Stop:

```bash
docker compose down
```

View logs:

```bash
docker compose logs
```

Open a shell:

```bash
docker exec -it <container> sh
```

List containers:

```bash
docker ps
```

List volumes:

```bash
docker volume ls
```

---

## Notes

- Containers are stateless.
- Database persistence is provided by Docker volumes.
- Applications communicate through Docker networking rather than fixed IP addresses.
- Apache acts as the reverse proxy and forwards requests to the appropriate container.