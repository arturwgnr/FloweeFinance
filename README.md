FLOWEE FINANCE - Full-Stack Personal Finance Tracker
====================================================

Flowee Finance is a full-stack web application designed to help users manage their personal finances in a simple, accessible, and efficient way.
Built as a real-world portfolio project, Flowee connects a React frontend with a Node.js backend using Express, Prisma, and PostgreSQL.

----------------------------------------------------
🧠 PROJECT OVERVIEW
----------------------------------------------------
Flowee allows users to register, log in, and manage their transactions in one clean and intuitive dashboard.
The app is focused on usability and accessibility, with a minimalist interface suitable for all audiences, including older users.

----------------------------------------------------
⚙️ TECH STACK
----------------------------------------------------
Backend:
- Node.js
- Express
- Prisma ORM
- PostgreSQL (Railway)
- bcryptjs

Frontend:
- React (Vite)
- React Router
- CSS (pure, responsive design)

----------------------------------------------------
📂 PROJECT STRUCTURE
----------------------------------------------------
FloweeFinance/
│
├── backend/
│   ├── prisma/
│   ├── index.js
│   ├── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   ├── package.json
│
└── README.txt

----------------------------------------------------
🧩 BACKEND ROUTES
----------------------------------------------------
| Method | Route                      | Description                               |
|--------|-----------------------------|-------------------------------------------|
| GET    | /                           | Root route for testing                    |
| POST   | /register                   | Register a new user                       |
| POST   | /login                      | Authenticate user                         |
| GET    | /transactions/:userId       | Get all transactions for a specific user  |
| POST   | /transactions/:userId       | Add new transaction                       |
| PUT    | /transactions/:id           | Edit transaction                          |
| DELETE | /transactions/:id           | Delete transaction                        |
| DELETE | /transactions/user/:userId  | Delete all transactions from a user       |

----------------------------------------------------
💻 FRONTEND FEATURES (IN PROGRESS)
----------------------------------------------------
- ✅ Routing setup (Landing, Register, Login, Dashboard)
- ✅ Form state management using React hooks
- 🔄 API integration with backend
- 🔒 Authentication context for user sessions
- 📊 Transaction CRUD management on dashboard
- 🎨 Simple and accessible design for elderly users

----------------------------------------------------
🧭 HOW TO RUN LOCALLY
----------------------------------------------------
1. Clone the repository:
   git clone https://github.com/arturwgnr/FloweeFinance.git
   cd FloweeFinance

2. Run the backend:
   cd backend
   npm install
   npx prisma generate
   npm run dev

3. Run the frontend:
   cd ../frontend
   npm install
   npm run dev

4. Access the app at:
   http://localhost:5173

----------------------------------------------------
🚀 DEPLOYMENT
----------------------------------------------------
- Backend: Railway
- Frontend: Vercel
- Database: PostgreSQL (Railway)

----------------------------------------------------
👨‍💻 DEVELOPER
----------------------------------------------------
Artur Wagner
Based in Ireland
Frontend Developer in training, focused on building real, functional projects that demonstrate technical ability, discipline, and design awareness.

GitHub: https://github.com/arturwgnr -

----------------------------------------------------
📜 LICENSE
----------------------------------------------------
This project is open source and available under the MIT License.
