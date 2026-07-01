# ---------- BASE ----------
FROM node:22 AS base

WORKDIR /usr/src/app

COPY shared ./shared
COPY pnpm-lock.yaml ./
COPY turbo.json ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY tsconfig.base.json ./
COPY proto ./proto

COPY services/orchestration/package*.json ./services/orchestration/
COPY services/orchestration/jest.config.js ./services/orchestration/
COPY services/orchestration/tsconfig.json ./services/orchestration/
COPY services/orchestration/src ./services/orchestration/src/
COPY services/orchestration/__tests__ ./services/orchestration/__tests__/
COPY services/orchestration/prisma ./services/orchestration/prisma/

# ---------- BUILD ----------
FROM base AS build

ENV NODE_ENV=development

RUN apt-get update && apt-get install -y protobuf-compiler

RUN corepack enable
RUN pnpm install --frozen-lockfile

RUN mkdir -p ./services/orchestration/src/grpc/generated
RUN pnpm run --filter orchestration proto:generate

RUN pnpm --filter @shared/logger build
RUN pnpm --filter @shared/grpc-client-manager build
RUN pnpm --filter @shared/kafka-manager build
RUN pnpm --filter @shared/pg-boss-manager build

RUN pnpm --filter orchestration build

RUN pnpm prune --prod


# ---------- PREDEPLOY ----------
FROM node:22 AS predeploy

WORKDIR /usr/src/app

COPY pnpm-lock.yaml ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY tsconfig.base.json ./
COPY services/orchestration ./services/orchestration

RUN corepack enable
RUN pnpm install --frozen-lockfile --prod=false

WORKDIR /usr/src/app/services/orchestration

CMD ["pnpm", "exec", "prisma", "migrate", "deploy", "--schema=prisma/schema.prisma"]


# ---------- DEV ----------
FROM build AS dev

ENV NODE_ENV=development

COPY --from=base /usr/local/bin/corepack /usr/local/bin/corepack
RUN corepack enable
RUN corepack prepare pnpm@8.6.3 --activate

RUN chown -R node:node /usr/src/app

USER node

EXPOSE 50051

CMD ["pnpm", "--filter", "orchestration", "start"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD nc -z localhost 50051 || exit 1


# ---------- PROD ----------
FROM node:22 AS prod

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=build /usr/src/app/services/orchestration/node_modules ./services/orchestration/node_modules
COPY --from=build /usr/src/app/services/orchestration/dist ./services/orchestration/dist
COPY --from=build /usr/src/app/shared ./shared

USER node

EXPOSE 50051

CMD ["node", "./services/orchestration/dist/app.js"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD nc -z localhost 50051 || exit 1