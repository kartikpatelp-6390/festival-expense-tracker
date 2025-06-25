# Stage 1: Build the Angular app
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

# 👇 Fix: Set legacy OpenSSL mode for Webpack compatibility
ENV NODE_OPTIONS=--openssl-legacy-provider

RUN npm install
RUN npm run build -- --configuration production

# Stage 2: Serve using NGINX
FROM nginx:1.25-alpine

# Clean and copy the built files
COPY --from=builder /app/dist/front-end /usr/share/nginx/html

# Copy custom nginx config (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
