FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY patches ./patches

RUN corepack enable && corepack pnpm install --frozen-lockfile

COPY . .

RUN corepack pnpm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/index.js"]
