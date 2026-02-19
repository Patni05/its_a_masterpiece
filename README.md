# Tradex - MERN Trading Platform

Tradex is a full-stack MERN trading platform with JWT auth, simulated/external real-time stock feeds, portfolio analytics, admin controls, and an embedded assistant chatbot.

## Architecture

```
tradex/
├── backend/      # Express + MongoDB + Socket.IO API
├── frontend/     # React + Vite UI
├── docs/API.md   # REST & WebSocket documentation
└── package.json  # workspace runner
```

## Features

- Secure JWT authentication (signup/login/forgot/reset password)
- Role-based access (user/admin)
- Buy/sell order execution with holdings + balance updates
- Real-time stock updates via Socket.IO
- Stock history persistence and analytics in MongoDB
- Interactive charts for live + assistant analytics
- Searchable stock universe
- Dashboard: balance, portfolio overview, open/history orders, P/L metrics
- Built-in chatbot assistant for trading guidance + Tata/Jio trend analysis
- Admin panel for users, stock listings, and platform analytics

## Setup

1. Install dependencies
   ```bash
   npm run install:all
   ```
2. Configure environment
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
3. Start MongoDB locally (or use remote URI) and update `MONGO_URI`.
4. (Optional) Seed admin user
   ```bash
   npm run seed --workspace backend
   ```
5. Run backend + frontend
   ```bash
   npm run dev
   ```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Environment examples

### Backend (`backend/.env`)

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/tradex
JWT_SECRET=replace_with_strong_secret
JWT_EXPIRES_IN=7d
STOCK_API_URL=https://your-stock-api.example/quote
STOCK_API_KEY=demo_key
STOCK_SYNC_INTERVAL_MS=12000
ADMIN_EMAIL=admin@tradex.dev
ADMIN_PASSWORD=Admin123!
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=http://localhost:5000
```

## UI layout description

- Sticky top navigation with role-aware links.
- Dashboard cards for portfolio stats, live market ticker, chart, order panel, order history, and chatbot.
- Admin page cards for platform metrics, user directory, and stock listing form.
- Auth page includes login, signup, forgot password, and reset-password modes.

## API docs

Detailed endpoint list and websocket event contract is in [`docs/API.md`](docs/API.md).
