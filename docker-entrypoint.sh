#!/bin/sh
set -e

# Fix permissions for the mounted volume
chown -R nextjs:nodejs /app/prisma/db

# Ensure DATABASE_URL is set, default to the container path if not provided
export DATABASE_URL=${DATABASE_URL:-"file:/app/prisma/db/dev.db"}

echo "Pushing schema to database..."
# Run prisma command as nextjs user
su-exec nextjs npx -y prisma@5.19.1 db push --skip-generate --accept-data-loss

echo "Checking database file..."
ls -la /app/prisma/db

# Run the main container command as nextjs user
exec su-exec nextjs "$@"
