FROM node:22.20-alpine AS builder

WORKDIR /app

# Copy required files
COPY . .

# Install dependencies
RUN npm install -g corepack@0.34.0
RUN corepack prepare pnpm@10.17.1 --activate
RUN pnpm install --frozen-lockfile

# Generate prisma client
RUN pnpm prisma generate

# Build the project
RUN pnpm build

# Run migrations
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN pnpm prisma migrate deploy

FROM node:22.20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

EXPOSE 3000

CMD [ "node", "build" ]