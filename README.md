# 💬 Realtime Chat App

A full-stack real-time chat application built with **React**, **Node.js**, and **Socket.io**. This application allows users to join a global chat room, send instant messages, and see who is currently typing.

🚀 **Live Demo:** [https://chatapp-frontend-usgs.onrender.com](https://chatapp-frontend-usgs.onrender.com)

## ✨ Features

* **Real-time Messaging**: Instant message delivery using WebSocket (Socket.io).
* **Live Typing Indicators**: See when other users are typing a message.
* **User Identification**: Simple username entry to join the conversation.
* **Group Chat**: All users connect to a shared room ("room1") for group communication.
* **Responsive UI**: Clean and responsive interface styled with CSS-in-JS and Tailwind.
* **Timestamps**: Messages are time-stamped for context.

## 🛠️ Tech Stack

**Frontend:**
* [React](https://reactjs.org/) (Vite)
* [Socket.io Client](https://socket.io/)
* [Tailwind CSS](https://tailwindcss.com/)

**Backend:**
* [Node.js](https://nodejs.org/)
* [Express](https://expressjs.com/)
* [Socket.io](https://socket.io/)

**Deployment:**
* [Render](https://render.com/) (Separate services for Web Service and Static Site)

## 📂 Project Structure

This repository is organized as a monorepo containing both the client and server code:

ChatApp/ ├── backend/ # Node.js/Express server code │ ├── server.js # Main server entry point │ └── ... └── frontend/ # React client code ├── src/ # UI Components and Logic └── ...


## 🚀 Getting Started Locally

Follow these steps to run the application on your local machine.

### Prerequisites
* Node.js installed (v18+ recommended)
* npm or yarn

### 1. Clone the Repository
```bash
git clone [https://github.com/Bhushan144/ChatApp.git](https://github.com/Bhushan144/ChatApp.git)
cd ChatApp

2. Setup Backend
Open a terminal and navigate to the backend folder:

Bash

cd backend
npm install
npm run dev
The server will start on http://localhost:4600

3. Setup Frontend
Open a new terminal window and navigate to the frontend folder:

Bash

cd frontend
npm install
npm run dev
The frontend will start (usually on http://localhost:5173). Open this URL in your browser to chat.

⚙️ Environment Variables
The application is configured to work out-of-the-box for local development.

Backend: Runs on port 4600 by default.

Frontend: Connects to http://localhost:4600 by default.

For production (Render), the frontend uses the VITE_BACKEND_URL environment variable to connect to the live server.
