FROM node:22-bookworm-slim

WORKDIR /app
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile && VITE_SENSE_EXPERIENCE_SINGLE_ORIGIN=true pnpm build

ENV NODE_ENV=production
ENV PORT=3000
CMD ["pnpm", "start"]
