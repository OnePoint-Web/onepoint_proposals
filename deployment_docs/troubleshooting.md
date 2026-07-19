# Troubleshooting

## Docker container cannot be removed (`device or resource busy`)

### Symptoms

Attempting to remove a Docker container fails.

Example commands:

```bash
docker rm <container>
```

or

```bash
docker compose down
```

Error:

```text
driver "overlay2" failed to remove root filesystem:
unlinkat .../merged: device or resource busy
```

Example output:

```text
driver "overlay2" failed to remove root filesystem:
unlinkat /var/lib/docker/overlay2/<overlay-id>/merged:
device or resource busy
```

---

### Cause

On this cPanel server, **VirtFS (Jailed Shell)** can mount Docker's OverlayFS inside a jailed user's filesystem.

Example:

```text
/home/virtfs/ironbornreg/var/lib/docker/overlay2/<overlay-id>/merged
```

Although the Docker container has stopped, the OverlayFS mount remains active inside VirtFS. As a result, Docker cannot remove the container because the filesystem is still in use.

This issue originates from the cPanel jailed-shell environment rather than Docker itself.

---

### Diagnosis

If `docker rm` reports `device or resource busy`, locate the corresponding overlay mount:

```bash
mount | grep overlay2
```

or, if you know the overlay ID:

```bash
mount | grep <overlay-id>
```

Example:

```text
overlay on /home/virtfs/ironbornreg/var/lib/docker/overlay2/<overlay-id>/merged
type overlay (...)
```

---

### Resolution

Unmount the VirtFS overlay:

```bash
sudo umount /home/virtfs/<cpanel-user>/var/lib/docker/overlay2/<overlay-id>/merged
```

Then remove the container normally:

```bash
docker rm <container>
```

---

### Notes

- The affected cPanel user may not be the user performing the deployment.
- The mount originates from VirtFS, not Docker.
- This issue has occurred with both the Proposal Portal container and the MariaDB container.
- If this issue occurs again, inspect VirtFS mounts before attempting further Docker cleanup.

---

## Site works, then serves stale data after any create/delete

### Symptoms

- A proposal, package, or user is created (or deleted) successfully — confirmed present/absent directly in the database.
- The list page for that entity still shows the old state.
- A hard refresh or an Incognito/Private window shows the correct, current data.
- `curl` directly against the API returns the correct data too.

---

### Cause

A **server-wide** Apache include on the cPanel box injects a long-lived `Cache-Control` header onto every response proxied through Apache, including dynamic JSON API responses that should never be cached:

```text
/etc/apache2/conf.d/includes/pre_virtualhost_2.conf

<IfModule mod_expires.c>
ExpiresActive On
...
ExpiresDefault "access 1 month"
</IfModule>
```

This file is managed via **WHM → Apache Configuration → Include Editor → Pre VirtualHost → All Versions** and is merged into *every* vhost on the server. `ExpiresDefault` is the fallback that applies to any response whose content type isn't explicitly listed in `ExpiresByType` — which includes `application/json`. `"access 1 month"` = 2,592,000 seconds, which is the exact `max-age` value seen on affected responses. It applies per-domain independently — fixing one subdomain does not fix another.

---

### Diagnosis

Isolate each layer before assuming which one is responsible:

```bash
# 1. Hits the app directly, bypassing Apache and Cloudflare entirely
#    (the app's port is only bound to the host's own loopback — see docker.md)
curl -sD - http://127.0.0.1:3000/api/proposals -o /dev/null | grep -i cache-control

# 2. Hits Apache directly, bypassing Cloudflare (uses --resolve so TLS SNI
#    and the Host header both match, unlike hitting the IP directly)
curl -skD - --resolve <domain>:443:127.0.0.1 https://<domain>/api/proposals -o /dev/null | grep -i cache-control

# 3. Full public path, through Cloudflare too
curl -sD - https://<domain>/api/proposals -o /dev/null | grep -i cache-control
```

If (1) shows no cache header (or the app's own `no-store`) but (2)/(3) show `max-age=2592000`, Apache is adding it. Also check `cf-cache-status` — `DYNAMIC` means Cloudflare's edge is not the one caching it.

---

### Resolution

Don't edit the shared global include — it's likely intentional for real static assets on other sites on this box. Add a **per-vhost override** instead, using the customization point each vhost's config already points to:

```bash
sudo mkdir -p /etc/apache2/conf.d/userdata/ssl/2_4/<cpanel-user>/<domain>/
sudo mkdir -p /etc/apache2/conf.d/userdata/std/2_4/<cpanel-user>/<domain>/

sudo tee /etc/apache2/conf.d/userdata/ssl/2_4/<cpanel-user>/<domain>/zz-no-expires.conf > /dev/null <<'EOF'
<IfModule mod_expires.c>
    ExpiresActive Off
</IfModule>
EOF

sudo cp /etc/apache2/conf.d/userdata/ssl/2_4/<cpanel-user>/<domain>/zz-no-expires.conf \
        /etc/apache2/conf.d/userdata/std/2_4/<cpanel-user>/<domain>/zz-no-expires.conf

sudo /scripts/rebuildhttpdconf
sudo /scripts/restartsrv_httpd
```

Don't hand-edit `httpd.conf` directly — cPanel regenerates it from these userdata includes, so direct edits get silently overwritten on the next rebuild.

As defense in depth (not a substitute for the Apache fix — Apache can still override whatever the app sends), both `onepoint_proposals` and `client_portal` also set an explicit header in `next.config.mjs`:

```js
async headers() {
  return [{ source: '/api/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }] }]
}
```

---

### Notes

- `Header unset Cache-Control` strips the header entirely, including the app's own legitimate one — prefer `ExpiresActive Off` alone so the app's `no-store` passes through untouched.
- This must be applied **separately to every subdomain** on the box (`proposalsportal.1pt.com.au` and `clientportal.1pt.com.au` both needed it independently).
- `application/pdf` is also caught by the same `ExpiresByType` list in the global include (1 month) — generated proposal PDFs are subject to the same staleness risk in the browser.

---

## PDF generation times out (`Navigation timeout of 30000 ms exceeded`)

### Symptoms

`docker compose logs` shows:

```text
PDF ERROR: Error [TimeoutError]: Navigation timeout of 30000 ms exceeded
```

The download either hangs for ~30s and then fails, or returns `{"error":"Navigation timeout of 30000 ms exceeded"}`.

---

### Cause

`NEXT_PUBLIC_APP_URL` was set to the public domain (`https://proposalsportal.1pt.com.au`) instead of `http://localhost:3000`. Puppeteer runs *inside the same container* as the Next.js server it's rendering, but with the public URL it has to leave the container, go out through the internet, hit Cloudflare, come back through Apache, and reach the host's published port — a fragile round trip with several points that can hang (Cloudflare bot protection, DNS, NAT hairpinning), rather than a direct in-container loopback call.

Confirm by comparing timing: the same page fetched directly over the public domain (`curl`) returns in under a second, while the Puppeteer-driven PDF route times out — proving the page/data isn't slow, the *navigation path* is.

---

### Resolution

In the app's own `.env` (not the root `/apps/.env`):

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Recreate the container — **no rebuild required**, since `.env` is excluded from the Docker build context (see `.dockerignore`) and is read fresh via `env_file` at container start, not baked into the image:

```bash
cd ~/apps
docker compose up -d
```

If that doesn't pick it up, force recreation:

```bash
docker compose up -d --force-recreate proposal_portal
```

---

### Notes

- `NEXT_PUBLIC_APP_URL` is used *only* for Puppeteer's internal navigation in the PDF routes (`/api/proposals/[slug]/pdf`, `/api/discovery/[id]/pdf`). Emailed/shareable proposal links use a separate variable, `PORTAL_URL`, and are unaffected by this.
- Applies equally to any future server-side Puppeteer/headless-browser usage added to either app.

---

## Creating a proposal (or package) returns Internal Server Error for long text, but not short text

### Symptoms

- Simple proposals (short deal/item text) create fine.
- A proposal or package with a longer paragraph in a deal item, offer description, or team member bio returns a generic Internal Server Error, not a validation error.
- The Zod schemas involved have no `.max()` length constraints, so it isn't obvious from the code why it's failing.

---

### Cause

Several Prisma `String` fields had no native type override, so Prisma defaults them to `VARCHAR(191)` on MySQL/MariaDB. Pasting text longer than 191 characters causes MariaDB to reject the insert with `Data too long for column` — a raw database error, not a Zod validation failure, so it isn't caught by the API's specific error handling and falls through to a generic 500.

---

### Resolution

Widen the affected columns to `@db.LongText` in `schema.prisma`, matching the convention already used for fields like `executiveSummary` and `paymentTerms`, then migrate:

```bash
npx prisma migrate dev --name <description>   # locally, to generate + apply
npx prisma migrate deploy                      # on the VPS, inside the container — see deployment.md
```

Fields fixed so far (onepoint_proposals): `PackageDealItem.item`, `PackageDealEntry.itemEntry`, `DealItem.dealItem`, `DealEntry.itemEntry`, `OfferEntry.description`, `OfferEntry.itemDiscountDescription`, `ServiceProductOffer.discountDescription`, `SlaOffer.discountDescription`, `TeamMember.description`.

---

### Notes

- `MODIFY COLUMN` from `VARCHAR` to `LONGTEXT` is a lossless widening — safe to run against production data with no risk of truncation. It does require MariaDB to rebuild the table internally (not a metadata-only change), but for these table sizes that's effectively instant.
- **Rule of thumb for new fields**: any free-text field a user could reasonably paste a paragraph into should be `@db.LongText` (or `@db.Text`) from the start, not the Prisma default. Don't wait for a 500 to find the next one.
- Two parallel model pairs exist for deal content — `PackageDealItem`/`PackageDealEntry` (used by proposals) and `DealItem`/`DealEntry` (used by the reusable `Package` catalog). They're easy to fix one and miss the other since they look unrelated at a glance.

---

## Bug fix works locally but not on the live site, even after redeploying

### Symptoms

- A fix is committed and pushed.
- The live site still exhibits the old behavior.
- `docker compose logs` shows debug output (e.g. old `console.log` lines) that was removed from the source weeks or commits ago.

---

### Cause

`git push` does not redeploy anything by itself — there's no CI/CD or webhook auto-pull configured. The Docker image is built via `COPY . .` in the Dockerfile, from whatever happens to be checked out **on the VPS** at the moment `docker compose up --build` is run. If the VPS working directory wasn't `git pull`ed first, the image is built from stale source regardless of what's on GitHub.

---

### Diagnosis

Find a string that a specific commit added or removed, and check whether it still appears in the running container's logs or behavior:

```bash
docker compose logs --tail 100 <service> | grep "<string removed by the fix>"
```

If it's still present, the running image predates that commit.

---

### Resolution

```bash
cd ~/apps/<app-directory>
git fetch && git pull

cd ~/apps
docker compose up --build -d <service>
```

---

### Notes

- **`--build` is only required for code/config changes.** A change to an environment variable in `.env` does *not* need a rebuild — see "PDF generation times out" above — because `.env` is excluded from the Docker build context and read at container start, not build time. Running `--build` unnecessarily isn't harmful, just slower.
- Any change to `next.config.*`, `.js`/`.jsx` source files, `schema.prisma`, or `package.json` **does** need `--build`; `docker compose up -d` alone will keep serving the old image.
- Check `docker compose ps` and `docker inspect <container>` (image creation timestamp) if there's ever doubt about whether a rebuild actually happened.
