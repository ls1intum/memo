# Development stage
FROM node:24.3 AS development
ENV NPM_VERSION=11.4.2
RUN npm install -g npm@$NPM_VERSION
RUN npm config set fetch-timeout 300000

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]

# Build stage
FROM node:24.3 AS builder
ENV NPM_VERSION=11.4.2
RUN npm install -g npm@$NPM_VERSION
RUN npm config set fetch-timeout 300000

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Production stage
FROM node:24.3-alpine AS production
WORKDIR /app

# Copy package files and install only production dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production --legacy-peer-deps

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
