# Architecture

## Overview

The application is deployed as a set of Docker containers behind an Apache reverse proxy running on a cPanel-managed Linux VPS.

Each application runs in its own container, while sharing a single MariaDB instance.

```
Internet
    │
    ▼
Cloudflare
    │
    ▼
Apache (cPanel)
    │
    ├──────────────► Proposal Portal (Next.js)
    │                     │
    │                     ▼
    ├──────────────► Client Portal (Next.js)
    │                     │
    ▼                     ▼
              MariaDB (shared)
```

```
                        Internet
                            │
                            ▼
                     Cloudflare DNS
                            │
                            ▼
                   Apache (Reverse Proxy)
                     │               │
                     ▼               ▼
          Proposal Portal     Client Portal
             (Next.js)           (Next.js)
                   │               │
                   └───────┬───────┘
                           ▼
                     MariaDB Container
                    (Persistent Volume)
```
---

## Components

### Cloudflare

Responsibilities:

- DNS management
- SSL termination
- Reverse proxy
- CDN and caching
- DDoS protection

---

### Apache

Responsibilities:

- Receives incoming HTTPS requests.
- Routes requests to the appropriate Docker container using reverse proxy rules.

Example:

| Domain | Container | Host Port |
|---------|-----------|----------:|
| proposalsportal.1pt.com.au | Proposal Portal | 3000 |
| clientportal.1pt.com.au | Client Portal | 3001 |

Apache forwards traffic using `ProxyPass` and `ProxyPassReverse`.

This Apache instance is shared with other, unrelated sites on the same cPanel account/server. A server-wide `mod_expires` include applies a default browser cache lifetime to every vhost unless individually overridden — this affects both `proposalsportal.1pt.com.au` and `clientportal.1pt.com.au` independently, and is easy to mistake for an application bug (stale data after create/delete) rather than an Apache config issue. See `troubleshooting.md` → "Site works, then serves stale data after any create/delete."

---

### Proposal Portal

Technology:

- Next.js
- React
- Prismas

Responsibilities:

- Proposal management
- Proposal generation
- Business logic

Runs inside its own Docker container.

---

### Client Portal

Technology:

- Next.js
- React
- Prisma

Responsibilities:

- Client-facing portal
- Authentication
- Client access to proposals

Runs inside its own Docker container.

---

### MariaDB

A single MariaDB container is shared by both applications.

Each application connects using its own Prisma client.

Persistent data is stored using a Docker volume.

---

## Docker Network

All containers are attached to the same Docker network.

```
proposal-network
    │
    ├── proposal_portal
    ├── client_portal
    └── mysql
```

Containers communicate internally using Docker service names.

Example:

```
mysql:3306
```

instead of IP addresses.

---

## Persistent Storage

Database data is stored in the Docker volume:

```
onepoint_proposals_mysql_data
```

This allows the database to persist even if containers are recreated.

---

## Ports

| Service | Container Port | Host Port |
|---------|---------------:|----------:|
| Proposal Portal | 3000 | 3000 |
| Client Portal | 3000 | 3001 |
| MariaDB | 3306 | Internal only |

---

## Deployment Flow

1. Cloudflare receives the request.
2. Apache receives the request from Cloudflare.
3. Apache selects the appropriate virtual host.
4. Apache proxies the request to the correct Docker container.
5. The application processes the request.
6. The application communicates with MariaDB if required.
7. The response is returned through Apache to Cloudflare.