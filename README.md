# 🌆 Arada Project – Administrative Portal

A full-stack administrative portal designed for Arada Subcity. This platform offers a secure and user-friendly interface for managing users, roles, and departmental tasks. With role-based authentication and modern UI, the system empowers main admins, sub admins, and department leaders to work more efficiently.

## 🛠 Tech Stack

**Frontend:**  
- React.js  
- Styled-components  
- React Router DOM  
- Axios  
- Vite  
- React Icons

**Backend:**  
- Node.js  
- Express.js  
- PostgreSQL  
- bcrypt  
- jsonwebtoken  
- dotenv

## 🔐 Key Features

- ✅ Secure user authentication with hashed passwords
- 🎭 Role-based access (Main Admin, Sub Admin, Department Leader)
- 🧾 Department management with email-based login
- 📦 Token-based session management (JWT)
- 🖥 Responsive and animated frontend UI
- ⚠ Login lockout after multiple failed attempts

## 🖥️ Project Structure
AradaProject/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── db/
│ └── index.js
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ └── App.jsx
├── README.md
└── .env

## 🚀 Getting Started

### 📦 Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
2. Install backend dependencies:

npm install
3 , Configure environment variables:
Create a .env file in the backend root and add:

DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
4. Run the backend server:

npm start
🎨 Frontend Setup

1. Navigate to the frontend directory:

cd frontend
2. Install frontend dependencies:

npm install

3. Start the frontend development server:

npm run dev

