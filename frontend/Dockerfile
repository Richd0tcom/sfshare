    # Stage 1: Build
    FROM node:22-alpine AS build
    WORKDIR /app
    RUN npm install -g pnpm
    COPY package*.json ./
    RUN pnpm install
    COPY . .
    RUN pnpm run build

    # Stage 2: Serve with Nginx (or another web server)
    FROM nginx:1.27-alpine

    # Copy the built files to the Nginx web directory
    COPY --from=build /app/dist /usr/share/nginx/html
    
    # Step 8: Expose port 80 and start Nginx
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]