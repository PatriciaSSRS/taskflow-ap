# syntax=docker/dockerfile:1
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# Install production dependencies only, leveraging layer caching.
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Application source.
COPY src ./src

EXPOSE 3000
USER node

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O- http://localhost:3000/health || exit 1

CMD ["node", "src/server.js"]
