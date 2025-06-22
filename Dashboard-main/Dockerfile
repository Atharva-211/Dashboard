# 1. Base image for all stages
FROM node:18-alpine AS base

# 2. Dependencies layer
FROM base AS deps
WORKDIR /app

# Install required native dependencies
RUN apk add --no-cache libc6-compat

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# 3. Builder layer
FROM base AS builder
WORKDIR /app

# Copy dependencies and source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ensure 'standalone' output is configured in next.config.js
# Then build the Next.js application
RUN npm run build

# 4. Production runner
FROM base AS runner
WORKDIR /app

# Add app user and group
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Set environment variables (correct format)
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Copy standalone app output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Use non-root user
USER nextjs

# Expose Next.js default port
EXPOSE 3000

# Run the Next.js standalone server
CMD ["node", "server.js"]
