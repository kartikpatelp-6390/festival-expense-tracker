#Festival Expense API Docker
#Backend Docker
#Authors=kartik.patel

# Use lighweight Node image
FROM node:20-alpine

# set working directory
WORKDIR /app

# copy package.json and install only production deps
COPY package*.json ./
RUN npm install --production

#copy rest of backend code
COPY . .

# expose API port
EXPOSE 3000

# start API
CMD ["npm", "start"]