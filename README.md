# Task Management System


A Task Management System to efficiently manage tasks, with a frontend, backend, and chatbot integration. This project is designed to provide a seamless user experience for managing tasks and interacting with a bot for task assistance.

## 📦 Project Structure

- **`frontend/`**: The React-based frontend for user interactions.
- **`backend/`**: Node.js backend API for managing tasks.
- **`chatbot/`**: Chatbot backend, powered by Node.js.

## 🚀 Getting Started

To run this project locally, follow the steps below.

### 1. Clone the Repository

```
git clone https://github.com/harshitrishav2003/task-management-system.git
cd task-management-system
```

### 2. Frontend
To run the frontend:

Navigate to the frontend folder:
```

cd frontend
npm install
npm start
```
The frontend will be running on http://localhost:3000.

### 3. Backend
To run the backend API:

Navigate to the backend folder:
```
cd backend
npm install
node server.js
```
The backend will be running on http://localhost:5005.

### 4. Chatbot Backend
To run the chatbot backend:

Navigate to the backend folder:
```

cd backend
npm install
node bot.js
```
This will start the chatbot server.

### 🐳 Docker Integration
You can also use Docker to run the project in containers. Follow these steps to set up Docker:

###1. Build the Docker Image
To build the Docker image for the project, run the following command from the root directory:

```
docker build -t task-management-system .
```
### 2. Run the Docker Container
After building the Docker image, you can run the container with:
```
docker run -p 3000:3000 -p 5000:5000 task-management-system
```
This command will map the frontend to http://localhost:3000 and the backend to http://localhost:5000.

🔧 Dependencies
The project uses the following technologies and libraries:

Frontend:
React

Backend:
Node.js

Express

Chatbot:
Node.js

Docker:
For containerization

Other:
npm for package management
