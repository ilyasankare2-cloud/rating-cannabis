# Etapa 1: Construir la aplicación (Frontend)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: Ejecutar el servidor Node (Backend + Frontend estático)
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY server.js ./
COPY package*.json ./

ENV NODE_ENV=production
ENV PORT=80

EXPOSE 80

USER node

CMD ["node", "server.js"]
