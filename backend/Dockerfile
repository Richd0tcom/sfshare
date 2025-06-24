    # Stage 1: Build
    FROM node:22-alpine AS build
    WORKDIR /app
    RUN npm install -g pnpm
    COPY package.json pnpm-lock.yaml ./
    RUN pnpm install
    COPY . .
    
    # RUN pnpm run build

    # Stage 2: Production
    # FROM node:22-alpine
    # RUN npm install -g pnpm
    # WORKDIR /app
    # COPY --from=build /app/node_modules ./node_modules
    # COPY --from=build /app/dist ./dist
    # COPY package.json .
    # EXPOSE 7321
   