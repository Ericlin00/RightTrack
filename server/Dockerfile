# server/Dockerfile
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose server port
EXPOSE 3001

# Start the server
CMD ["node", "index.js"]
