FROM node:18-alpine

WORKDIR /app

# Instalar Docker CLI para controlar contenedores
RUN apk add --no-cache docker-cli

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
