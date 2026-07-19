# Deployment Guide

## Overview

This project is deployed on a Linux VPS running cPanel.

The deployment consists of:

- Apache (Reverse Proxy)
- Docker Compose
- Next.js applications
- MariaDB
- Cloudflare DNS

---

# Prerequisites

The server should already have:

- Docker
- Docker Compose
- Apache (cPanel)
- Git
- SSH access

---

# Directory Structure

```text
/apps
├── client_portal/
├── onepoint_proposals/
├── compose.yaml
└── .env
```

---

# 1. Clone the repositories

```bash
cd ~/apps

git clone <proposal-repository>
git clone <client-portal-repository>
```

---

# 2. Configure environment variables

Create the root `.env` file used by Docker Compose.

Example:

```env
DATABASE_ROOT_PASSWORD=...
DATABASE_NAME=...
DATABASE_USER=...
DATABASE_PASSWORD=...
```

Each application should also contain its own `.env` file.

Example:

```text
client_portal/.env
onepoint_proposals/.env
```

---

# 3. Configure Docker Compose

Ensure `compose.yaml` contains:

- Proposal Portal
- Client Portal
- MariaDB

Both applications should be attached to the same Docker network.

MariaDB should use the persistent Docker volume.

---

# 4. Create cPanel Subdomains

Create the required subdomains:

- proposalsportal.1pt.com.au
- clientportal.1pt.com.au

Allow AutoSSL to generate certificates.

---

# 5. Configure Apache Reverse Proxy

Create:

```text
/etc/apache2/conf.d/userdata/std/2_4/<cpanel-user>/<domain>/proxy.conf
```

and

```text
/etc/apache2/conf.d/userdata/ssl/2_4/<cpanel-user>/<domain>/proxy.conf
```

Example:

```apache
ProxyPreserveHost On

ProxyPass / http://127.0.0.1:<host-port>/
ProxyPassReverse / http://127.0.0.1:<host-port>/
```

Proposal Portal:

```
3000
```

Client Portal:

```
3001
```

Rebuild Apache:

```bash
/usr/local/cpanel/scripts/rebuildhttpdconf
systemctl restart httpd
```

---

# 6. Build and Start Containers

From the `/apps` directory:

```bash
docker compose up --build -d
```

Verify:

```bash
docker ps
```

---

# 7. Database Setup

Migrations must be run **inside the running container**, not on the VPS host — the app connects to the `mysql` service by its Docker network name, which isn't reachable from outside the `proposal-network` Docker network, and the container has the correct `DATABASE_URL` already loaded via `env_file`.

```bash
# 1. Check what's pending — read-only, safe to run any time
docker compose exec proposal_portal npx prisma migrate status

# 2. Back up first — cheap insurance before any schema change
docker compose exec mysql mariadb-dump -u root -p"$DATABASE_ROOT_PASSWORD" <database_name> > backup_$(date +%Y%m%d).sql

# 3. Apply pending migrations
docker compose exec proposal_portal npx prisma migrate deploy
```

If deploying for the first time:

```bash
docker compose exec proposal_portal npx prisma db seed
```

Note: `prisma` (the CLI) is a `devDependency` and is pruned out of the production image by `npm prune --omit=dev` in the Dockerfile — only `@prisma/client` (the generated client used at runtime) ships in the final image. `npx` will fetch the CLI on demand from the registry the first time this is run in a given container, which requires outbound internet access from the container and works fine for `migrate deploy` in practice, but is worth knowing if it ever fails with a network-related error instead of a migration error.

---

# 8. Verify Deployment

Test locally:

```bash
curl http://127.0.0.1:3000
curl http://127.0.0.1:3001
```

Verify public URLs:

- https://proposalsportal.1pt.com.au
- https://clientportal.1pt.com.au

---

# Troubleshooting

Known deployment issues are documented in:

```
docs/troubleshooting.md
```