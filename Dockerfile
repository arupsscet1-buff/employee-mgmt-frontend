# --- Build Stage ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Hardened Distroless Runtime Stage ---
FROM cgr.dev/chainguard/nginx:latest

# Chainguard expects assets here
COPY --from=build /app/dist /usr/share/nginx/html

# Chainguard NGINX runs on port 8080 by default
EXPOSE 80

CMD ["-g", "daemon off;"]
