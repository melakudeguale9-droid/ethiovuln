# ─── EthioVuln Frontend Dockerfile ──────────────────────────────────────────

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (layer cache)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .

# BACKEND_URL is used by next.config.ts rewrite at build time
ARG BACKEND_URL=https://ethiovuln-backend.onrender.com
ENV BACKEND_URL=${BACKEND_URL}

# NEXT_PUBLIC vars must be set at build time for client-side usage
ARG NEXT_PUBLIC_WS_URL=wss://ethiovuln-backend.onrender.com
ENV NEXT_PUBLIC_WS_URL=${NEXT_PUBLIC_WS_URL}

RUN npm run build

# Stage 2: Production runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=10000
ENV HOSTNAME="0.0.0.0"

# Copy only what's needed to run
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 10000

CMD ["node", "server.js"]