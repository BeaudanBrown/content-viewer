# Use the Nginx image from Docker Hub
FROM nginx:alpine

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy a new configuration file from the current directory
COPY nginx.conf /etc/nginx/conf.d

# Copy the HTML and audio file to the web root
COPY puss.mp4 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

COPY index.html /usr/share/nginx/html

# Start Nginx when the container has provisioned
CMD ["nginx", "-g", "daemon off;"]
