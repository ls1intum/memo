# Base stage with common dependencies
FROM node:24.3 AS base
ENV NPM_VERSION=11.4.2
RUN npm install -g npm@$NPM_VERSION && \
    npm config set fetch-timeout 300000
WORKDIR /app

# Development stage
FROM base AS development
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Dependencies stage (for production)
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --only=production --legacy-peer-deps

# Builder stage
FROM base AS builder
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Production stage
FROM node:24.3-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000
CMD ["npm", "start"]
