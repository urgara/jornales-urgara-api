# Build stage
FROM node:22.12.0-alpine3.20 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code first
COPY . .

# Generate Prisma clients for both databases after copying source
# Use placeholder DATABASE_URL for prisma generate (actual DB not needed)
RUN DATABASE_COMMON_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" \
    DATABASE_LOCALITY_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" \
    pnpm run prisma:generate:all

# Build application
RUN pnpm run build

# Production stage
FROM node:22.12.0-alpine3.20 AS production

# Install dumb-init for signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001 -G nodejs

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm and production dependencies only
# Use --shamefully-hoist to avoid symlink issues with Prisma in Docker
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile --prod --shamefully-hoist

# Copy built application from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/prisma-global ./prisma-global
COPY --from=builder --chown=nestjs:nodejs /app/prisma-locality ./prisma-locality
COPY --from=builder --chown=nestjs:nodejs /app/generated ./generated

# Pre-download Prisma engines to avoid runtime downloads
# This must be done as root before switching to nestjs user
# Use placeholder DATABASE_URLs as actual DBs are not needed for generate
RUN DATABASE_COMMON_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" \
    DATABASE_LOCALITY_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" \
    pnpm run prisma:generate:all

# Copy entrypoint and initialization scripts
COPY --chown=nestjs:nodejs scripts/docker-entrypoint.sh ./docker-entrypoint.sh
COPY --chown=nestjs:nodejs scripts/init-admin.js ./scripts/init-admin.js
RUN chmod +x docker-entrypoint.sh

# Switch to non-root user
USER nestjs

# Expose port dynamically based on environment variable
ARG PORT=3000
EXPOSE ${PORT}

# Use dumb-init and start application
ENTRYPOINT ["dumb-init", "--"]
CMD ["./docker-entrypoint.sh"]