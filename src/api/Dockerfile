FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:24-alpine AS production

USER node
WORKDIR /app

EXPOSE 3100

ENV NODE_ENV=production

COPY --from=builder --chown=node:node /app/package*.json ./

RUN npm ci --omit=dev

COPY --from=builder --chown=node:node /app/config ./config
COPY --from=builder --chown=node:node /app/dist ./dist

CMD ["node", "dist/index.js"]
