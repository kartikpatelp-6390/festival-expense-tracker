# Stage 1: Build Angular app
FROM node:18-alpine as builder

WORKDIR /app

COPY front-end/package*.json ./
RUN npm install

COPY front-end/ ./
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine

COPY --from=builder /app/dist/front-end /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
