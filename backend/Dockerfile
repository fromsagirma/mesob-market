# Mesob Market - Production Multi-Stage Backend Dockerfile

# Stage 1: Dependencies and builder
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts

# Stage 2: Minimal hardened runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=5000

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy dependencies and application source
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY config/ ./config/
COPY controllers/ ./controllers/
COPY errors/ ./errors/
COPY middleware/ ./middleware/
COPY models/ ./models/
COPY routes/ ./routes/
COPY services/ ./services/
COPY utils/ ./utils/
COPY validation/ ./validation/
COPY server.js ./

# Run as unprivileged node user
USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]
