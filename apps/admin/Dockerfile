FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /repo

FROM base AS build
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/admin/package.json apps/admin/package.json
RUN pnpm install --filter admin --frozen-lockfile
COPY apps/admin ./apps/admin
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN pnpm --filter admin build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /repo/apps/admin/.next ./.next
COPY --from=build /repo/apps/admin/public ./public
COPY --from=build /repo/apps/admin/package.json ./package.json
COPY --from=build /repo/apps/admin/next.config.js ./next.config.js
RUN npm install --omit=dev --no-package-lock --no-audit --no-fund
EXPOSE 5737
CMD ["node_modules/.bin/next", "start", "-p", "5737"]
