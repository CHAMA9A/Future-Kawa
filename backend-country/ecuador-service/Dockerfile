FROM node:22-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-slim AS production

# Install OpenSSL requis par Prisma
RUN apt-get update -qq && apt-get install -y -qq --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

# Régénère Prisma Client pour l'OS cible (debian-openssl-3.0.x)
RUN npx prisma generate

EXPOSE 3011

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]