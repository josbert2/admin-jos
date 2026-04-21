FROM node:20-alpine AS deps
WORKDIR /repo
RUN corepack enable
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/package.json
RUN pnpm install --filter api --frozen-lockfile

FROM node:20-alpine AS build
WORKDIR /repo
RUN corepack enable
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/api/node_modules ./apps/api/node_modules
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api ./apps/api
RUN pnpm --filter api build

FROM node:20-alpine AS prod-deps
WORKDIR /repo
RUN corepack enable
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/package.json
RUN pnpm install --filter api --prod --frozen-lockfile

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prod-deps /repo/node_modules ./node_modules
COPY --from=prod-deps /repo/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /repo/apps/api/dist ./dist
COPY --from=build /repo/apps/api/src/db/migrations ./dist/db/migrations
COPY apps/api/package.json ./package.json
COPY apps/api/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh
EXPOSE 4000
CMD ["./docker-entrypoint.sh"]
