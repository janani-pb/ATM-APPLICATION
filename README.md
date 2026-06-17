# NexaBank — ATM Banking System (MERN Stack)

A full-stack ATM banking application built with MongoDB, Express.js, React.js (Vite), and Node.js. Features JWT authentication, real-time balance management, transaction history, dark mode, and a polished responsive UI.

---

## 📁 Project Structure

```
project_1/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Signup, login, change-password
│   │   └── atmController.js       # Balance, deposit, withdraw, history, profile
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT protection middleware
│   ├── models/
│   │   ├── User.js                # User schema (account number, balance)
│   │   └── Transaction.js         # Transaction schema
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth/*
│   │   └── atmRoutes.js           # /api/atm/*
│   ├── server.js                  # Express app entry point
│   ├── .env                       # Environment variables (configure this)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Alert.jsx           # Reusable alert component
    │   │   ├── Navbar.jsx          # Responsive navbar with logout modal
    │   │   ├── ProtectedRoute.jsx  # Auth guard for private routes
    │   │   └── Spinner.jsx         # Loading spinner
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx       # Balance card + recent transactions
    │   │   ├── Deposit.jsx         # Deposit with quick-select amounts
    │   │   ├── Withdraw.jsx        # Withdraw with balance guard
    │   │   ├── History.jsx         # Paginated transaction history + filters
    │   │   ├── Profile.jsx         # Account info page
    │   │   └── ChangePassword.jsx  # Secure password update
    │   ├── services/
    │   │   ├── api.js              # Axios instance + auth/atm API methods
    │   │   └── AuthContext.jsx     # Global auth state (Context + hooks)
    │   ├── App.jsx                 # Router + theme provider
    │   ├── main.jsx
    │   └── index.css               # Custom design system styles
    ├── index.html
    ├── vite.config.js
    ├── .env
    └── package.json
```

---

## ⚙️ Prerequisites

- Node.js v18+
- npm v9+
- MongoDB Atlas account (free tier works fine)

---

## 🚀 Setup Guide

### Step 1 — Clone / Create Project

```bash
# Navigate to the project root
cd project_1
```

### Step 2 — Configure MongoDB Atlas

1. Go to https://cloud.mongodb.com and sign in
2. Create a free cluster (M0 Sandbox)
3. Under "Database Access" → Add database user (username + password)
4. Under "Network Access" → Add IP Address → Allow from anywhere (`0.0.0.0/0`) for dev
5. Click "Connect" → "Connect your application" → Copy the connection string

### Step 3 — Backend Setup

```bash
cd backend
npm install
```

Edit `.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<your-username>:<your-password>@cluster0.xxxxx.mongodb.net/atm_banking?retryWrites=true&w=majority
JWT_SECRET=choose_a_long_random_secret_string_here
NODE_ENV=development
```

Start the backend:

```bash
# Development (auto-restart on change)
npm run dev

# Production
npm start
```

You should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Server running on http://localhost:5000
```

### Step 4 — Frontend Setup

```bash
cd ../frontend
npm install
```

The `.env` file already has:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open: **http://localhost:5173**

---

## 🌐 API Reference

### Auth Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | Login, receive JWT | Public |
| PUT | `/api/auth/change-password` | Change password | 🔒 Private |

### ATM Endpoints (all require `Authorization: Bearer <token>`)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/atm/balance` | Get current balance |
| POST | `/api/atm/deposit` | Deposit money |
| POST | `/api/atm/withdraw` | Withdraw money |
| GET | `/api/atm/history` | Transaction history (paginated) |
| GET | `/api/atm/profile` | User profile + stats |

---

## 🧪 API Testing (cURL / Postman)

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Athav Kumar","email":"athav@example.com","password":"secret123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"athav@example.com","password":"secret123"}'
# Save the returned "token"
```

### Deposit (replace TOKEN)
```bash
curl -X POST http://localhost:5000/api/atm/deposit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"amount":5000}'
```

### Withdraw
```bash
curl -X POST http://localhost:5000/api/atm/withdraw \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"amount":1000}'
```

### Get Balance
```bash
curl http://localhost:5000/api/atm/balance \
  -H "Authorization: Bearer TOKEN"
```

### Transaction History (page 1, 10 per page)
```bash
curl "http://localhost:5000/api/atm/history?page=1&limit=10" \
  -H "Authorization: Bearer TOKEN"
```

### Health Check
```bash
curl http://localhost:5000/api/health
```

---

## 🗃️ Sample MongoDB Data

After signup + some transactions, your collections will look like:

**users collection:**
```json
{
  "_id": "ObjectId(...)",
  "name": "Athav Kumar",
  "email": "athav@example.com",
  "password": "$2a$12$...(bcrypt hash)...",
  "accountNumber": "400023847612",
  "balance": 4000,
  "lastLogin": "2024-01-15T10:30:00.000Z",
  "createdAt": "2024-01-14T08:00:00.000Z"
}
```

**transactions collection:**
```json
[
  {
    "_id": "ObjectId(...)",
    "userId": "ObjectId(user_id)",
    "transactionType": "deposit",
    "amount": 5000,
    "balanceAfterTransaction": 5000,
    "description": "Cash Deposit",
    "createdAt": "2024-01-15T09:00:00.000Z"
  },
  {
    "_id": "ObjectId(...)",
    "userId": "ObjectId(user_id)",
    "transactionType": "withdrawal",
    "amount": 1000,
    "balanceAfterTransaction": 4000,
    "description": "Cash Withdrawal",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
]
```

---

## ✨ Features

**Core Banking:**
- Deposit with quick-select amounts (₹500, ₹1K, ₹2K, ₹5K, ₹10K, ₹50K)
- Withdraw with live balance check + usage progress bar
- Paginated transaction history with deposit/withdrawal filter
- Real-time balance updates across all views

**Security:**
- JWT authentication (7-day expiry)
- bcrypt password hashing (12 salt rounds)
- Protected routes (frontend + backend)
- Auto-logout on token expiry

**UX / Design:**
- Dark mode toggle (persisted in localStorage)
- Logout confirmation modal
- Password strength indicator
- Auto-generated 12-digit account number
- Last login timestamp
- Responsive across mobile, tablet, desktop

**Bonus:**
- Profile page with account stats
- Change password feature
- Transaction summary (total deposited, withdrawn, net flow)
- INR currency formatting throughout

---

## 🔧 Troubleshooting

| Issue | Fix |
|-------|-----|
| `ECONNREFUSED` on frontend | Backend not running — run `npm run dev` in /backend |
| MongoDB connection error | Check MONGO_URI in .env, whitelist your IP in Atlas |
| JWT invalid token | Clear localStorage and log in again |
| CORS error | Ensure frontend runs on port 5173 (Vite default) |
| `module not found` | Run `npm install` in both /backend and /frontend |

---

## 🚢 Production Deployment

**Backend → Railway / Render / Heroku:**
1. Set environment variables in platform dashboard
2. Change CORS origin in `server.js` to your frontend URL
3. Deploy backend repo

**Frontend → Vercel / Netlify:**
1. Set `VITE_API_BASE_URL` to your deployed backend URL
2. Build: `npm run build`
3. Deploy the `/dist` folder

---

Built with  using the MERN Stack
