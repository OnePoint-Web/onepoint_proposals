# ---------- Stage 1: Install dependencies ----------
# node:22-slim (Debian) required — @sparticuz/chromium bundles a glibc binary
# that will not run on Alpine (musl libc)
FROM node:22-slim AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci

# ---------- Stage 2: Build the application ----------
FROM node:22-slim AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application (runs prisma generate + next build)
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev

# ---------- Stage 3: Production image ----------
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Shared libraries required by the Chromium binary bundled in @sparticuz/chromium
RUN apt-get update && apt-get install -y --no-install-recommends \
    libnss3 \
    libnspr4 \
    libgbm1 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libxcomposite1 \
    libxss1 \
    libxtst6 \
    libx11-xcb1 \
    fonts-liberation \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create a dedicated user to run the application
RUN groupadd -r nextjs && useradd -r -g nextjs nextjs

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/next.config.* ./

# Give the application user ownership of the app directory
RUN chown -R nextjs:nextjs /app

# Drop root privileges
USER nextjs

EXPOSE 3000

CMD ["npm", "start"]