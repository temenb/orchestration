# ---------- BASE ----------
FROM node:22 AS base

WORKDIR /usr/src/app

COPY shared ./shared
COPY pnpm-lock.yaml ./
COPY turbo.json ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY tsconfig.json ./

COPY services/orchestration/package*.json ./services/orchestration/
COPY services/orchestration/jest.config.js ./services/orchestration/
COPY services/orchestration/tsconfig.json ./services/orchestration/
COPY services/orchestration/prisma ./services/orchestration/prisma/
COPY services/orchestration/src ./services/orchestration/src/
COPY services/orchestration/__tests__ ./services/orchestration/__tests__/

# ---------- BUILD ----------
FROM base AS build

ENV NODE_ENV=development

RUN corepack enable \
 && pnpm install --frozen-lockfile \
 && pnpm run --filter orchestration build \
 && pnpm prune --prod


# ---------- DEV ----------
FROM build AS dev

ENV NODE_ENV=development

USER node

EXPOSE 50051

CMD ["pnpm", "--filter", "orchestration", "start"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:9090/livez || exit 1

# ---------- PROD ----------
FROM node:22 AS prod

WORKDIR /usr/src/app

ENV NODE_ENV=production

#COPY --from=build /usr/src/app /usr/src/app
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

USER node

EXPOSE 50051

CMD ["node", "dist/services/orchestration/src/app.js"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:9090/livez || exit 1
