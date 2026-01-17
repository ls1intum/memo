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
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

# Dependencies stage (for production)
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --legacy-peer-deps

# Builder stage
FROM base AS builder
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Production stage - serve static files with nginx
FROM nginx:alpine AS production

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

