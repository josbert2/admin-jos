FROM node:20-alpine AS deps
WORKDIR /repo
RUN corepack enable
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/admin/package.json apps/admin/package.json
RUN pnpm install --filter admin --frozen-lockfile

FROM node:20-alpine AS build
WORKDIR /repo
RUN corepack enable
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/admin/node_modules ./apps/admin/node_modules
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/admin ./apps/admin
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN pnpm --filter admin build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable
COPY --from=build /repo/apps/admin/.next ./.next
COPY --from=build /repo/apps/admin/public ./public
COPY --from=build /repo/apps/admin/package.json ./package.json
COPY --from=build /repo/apps/admin/next.config.js ./next.config.js
COPY --from=build /repo/apps/admin/node_modules ./node_modules
EXPOSE 5737
CMD ["node_modules/.bin/next", "start", "-p", "5737"]
