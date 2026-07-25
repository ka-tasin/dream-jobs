# stage - 1 : builder
FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .


ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npx prisma generate

RUN npm run build

# stage - 2 : Final

FROM node:22-slim AS final

WORKDIR /app

COPY package*.json ./ 
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/prisma/generated ./prisma/generated

COPY --from=builder /app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/src/server.js"]

