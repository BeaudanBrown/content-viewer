# Use the official Node.js 16 image as a parent image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) into the container
COPY package.json ./
COPY package-lock.json* ./

# Install project dependencies
# If you have native dependencies, you'll need extra tools
RUN apk add --no-cache --virtual .gyp python3 make g++ \
    && npm install \
    && apk del .gyp

# Copy the rest of your application's source code from your host to your container's working directory
COPY public/ public/
COPY uploads/ uploads/
COPY server.js ./

# Inform Docker that the container is listening on the specified port at runtime.
EXPOSE 3000

# Run the application
CMD ["node", "server.js"]
