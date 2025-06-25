# Stage 1: Build Angular App
FROM node:16 AS builder

WORKDIR /app
COPY . .
RUN npm install

RUN npm run build --prod

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine

# Copy built Angular app to nginx html folder
COPY dist/front-end /usr/share/ngnix/html
# COPY --from=builder /app/dist/front-end /usr/share/nginx/html

# Copy default nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
