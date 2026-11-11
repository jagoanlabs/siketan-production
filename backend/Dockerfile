# Gunakan Bun versi LTS
FROM oven/bun:alpine

WORKDIR /app

COPY package*.json ./
RUN bun install

COPY . .

EXPOSE 5001
CMD ["bun", "run", "index.js"]
