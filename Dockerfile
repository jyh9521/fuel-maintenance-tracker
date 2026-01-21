FROM node:20-alpine AS base

# Install OpenSSL for Prisma (version 3.x)
RUN apk add --no-cache openssl

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

# Set a dummy DATABASE_URL for build time (Prisma needs it to generate client)
ENV DATABASE_URL="file:/app/prisma/db/dev.db"

# Generate Prisma Client
RUN npx prisma generate

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install OpenSSL 1.1 compatibility for Prisma
# REMOVED: Managed in base stage
# RUN apk add --no-cache openssl compat-openssl11

# Uncomment the following line in case you want to enable automatic migrations on startup
# ENV MIGRATE_ON_STARTUP true

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema and migrations if needed for runtime
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Ensure persistence directory exists and has correct permissions
RUN mkdir -p /app/prisma/db && chown nextjs:nodejs /app/prisma/db

# Copy and setup entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
# Install dos2unix to fix potential Windows line ending issues and set permissions
USER root
RUN apk add --no-cache dos2unix su-exec && \
  dos2unix /usr/local/bin/docker-entrypoint.sh && \
  chmod +x /usr/local/bin/docker-entrypoint.sh

# Don't switch to USER nextjs here. We will do it in entrypoint.
# USER nextjs

EXPOSE 9521

ENV PORT=9521
# set hostname to localhost
ENV HOSTNAME="0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "server.js"]
