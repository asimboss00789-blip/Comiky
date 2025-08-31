# Use official PHP CLI image
FROM php:8.2-cli

# Set working directory inside the container
WORKDIR /app

# Copy all files from your repo into the container
COPY . .

# Expose the port that Render will assign
EXPOSE 10000

# Start PHP built-in server to serve index.html and backend APIs
CMD ["php", "-S", "0.0.0.0:10000", "-t", "."]
