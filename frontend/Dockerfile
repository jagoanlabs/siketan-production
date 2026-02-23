# Stage 1: Build React app
FROM oven/bun:alpine as build

WORKDIR /app
COPY package*.json ./
RUN bun install
COPY . .

# Build the React app
RUN bun run build

# Stage 2: Serve the built app using a simple server
FROM oven/bun:alpine as production

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./

# Install only production dependencies if there are any
RUN bun install --production

# Install a simple static server
RUN bun install -g serve

EXPOSE 80

# Serve the built React app
CMD ["serve", "-s", "dist", "-l", "80"]