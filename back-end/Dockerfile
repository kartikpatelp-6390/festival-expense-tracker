#Festival Expense API Docker
#Backend Docker
#Authors=kartik.patel

# Use lighweight Node image
FROM node:20-alpine

# Install necessary system dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    npm \
    bash

# set working directory
WORKDIR /app

# copy package.json and install only production deps
COPY package*.json ./
RUN npm install --production

#copy rest of backend code
COPY . .

# Set Puppeteer to use Alpine chromium path
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# expose API port
EXPOSE 3000

# start API
CMD ["npm", "start"]