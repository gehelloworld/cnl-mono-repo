ARG APP_NAME=cnl-be

#! Base
FROM node:20-slim AS base
RUN apt-get update && apt-get upgrade -y

#! Builder
FROM base AS builder
WORKDIR /app
ARG APP_NAME

# Install turbo globally
RUN npm install --ignore-scripts -g turbo@1.13.4

# Copy monorepo files and configuration
COPY cnl ./cnl
COPY pnpm-workspace.yaml .
COPY pnpm-lock.yaml .
COPY package.json .
COPY turbo.json .

# Prune the workspace for cnl-be
RUN turbo prune --scope=${APP_NAME} --docker

#! Installer
FROM base AS installer
WORKDIR /app
ARG APP_NAME

RUN npm install -g pnpm@9.11.0

# Copy pruned package files
COPY --from=builder /app/out/json/ .

# Fetch and then install dependencies offline for cnl-be
RUN pnpm fetch
RUN pnpm install --ignore-scripts --offline --filter=${APP_NAME}

# Copy the full source needed for building cnl-be
COPY --from=builder /app/out/full/ .

# Build the project
RUN pnpm build --filter=${APP_NAME}

# Prune dev dependencies after build to reduce image size
WORKDIR /app/cnl/cnl-be
RUN pnpm prune --prod

#! Runner
FROM base AS runner
RUN groupadd -r cnlgroup && useradd -m -r -g cnlgroup -d /home/cnl -s /bin/bash cnl
USER cnl

# Copy the pruned and built app into runner image
WORKDIR /home/cnl
COPY --chown=cnl:cnlgroup --from=installer /app ./app

ARG APP_NAME
WORKDIR /home/cnl/app/cnl/${APP_NAME}

EXPOSE 4000
CMD ["node", "dist/main.js"]