# Use official lightweight Nginx image
FROM nginx:alpine

# Set working directory to Nginx's default html root
WORKDIR /usr/share/nginx/html

# Remove the default Nginx welcome page
RUN rm -rf ./*

# Copy all project files into the container
COPY . .

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
