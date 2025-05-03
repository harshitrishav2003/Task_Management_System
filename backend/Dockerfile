# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the backend port (change if you use a different one)
EXPOSE 5000

# Start the backend
CMD ["node", "server.js"]
