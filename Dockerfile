# Use the official Node.js 16 image as a parent image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) into the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your application's source code from your host to your container's working directory
COPY . .

# Inform Docker that the container is listening on the specified port at runtime.
EXPOSE 3000

# Run the application
CMD ["node", "server.js"]
