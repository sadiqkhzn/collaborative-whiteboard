# Collaborative Whiteboard

A real-time collaborative whiteboard built with **React**, **Socket.IO**, **Node.js**, and **PostgreSQL**. Users can draw simultaneously in shared rooms, switch between brush and eraser, pick colors, and save their whiteboard data to a database.

---

## 🗂️ Project Structure

collaborative-whiteboard/

│

├── client/ # React frontend

│ └── src/

│ └── Whiteboard.jsx # Main whiteboard component

│

├── server/ # Express + Socket.IO backend

│ └── index.js # Main server entry

│

├── db/ # Sequelize and PostgreSQL models

│ └── index.js # Database setup and Whiteboard model

│

├── .env # Environment variables (not committed)

└── README.md # Project documentation


---

## ⚙️ Setup Instructions

### 1. Clone the Repository

git clone https://github.com/sadiqkhzn/collaborative-whiteboard.git
cd collaborative-whiteboard

### 2. Create .env File in Root

PORT=5000

DATABASE_URL=postgres://your_user:your_password@localhost:5432/your_db_name

REACT_APP_SERVER_URL=http://localhost:5000

### 3. Install Dependencies

Backend:

cd server
npm install

Frontend:

cd ../client
npm install

### 4. Start PostgreSQL

Ensure PostgreSQL is running and a database matching DATABASE_URL exists.

### 5. Run the App

Backend:

cd ../server
node index.js

Frontend:

cd ../client
npm start

### 🚀 Features :

🔁 Live collaboration — multiple users drawing in sync

✏️ Brush tool — adjustable color & thickness

🧼 Eraser tool — quick corrections

💾 Persistent storage — drawings saved to PostgreSQL

🌈 Color Picker — full color spectrum via Chrome Picker

### 🛠️ Built With :

React | Express | Socket.IO | PostgreSQL | Sequelize | React Color | dotenv

