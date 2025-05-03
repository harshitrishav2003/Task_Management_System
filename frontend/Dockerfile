
FROM node:18

# Set working directory
WORKDIR /app


COPY package*.json ./
RUN npm install


COPY . .

# Expose the frontend port
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]
