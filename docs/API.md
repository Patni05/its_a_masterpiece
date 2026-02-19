# Tradex API Documentation

Base URL: `http://localhost:5000/api`

## Auth
- `POST /auth/signup` - register user
- `POST /auth/login` - login
- `POST /auth/forgot-password` - generate reset token
- `POST /auth/reset-password` - reset password
- `GET /auth/me` - current profile (Bearer)

## Trading
- `GET /trade/portfolio` - portfolio + pnl metrics
- `GET /trade/orders` - order history
- `POST /trade/orders` - place buy/sell order `{ symbol, type, quantity }`

## Stocks
- `GET /stocks?q=tat` - searchable listing by name/symbol
- `GET /stocks/:symbol` - stock + recent history
- `GET /stocks/:symbol/analytics` - aggregate analytics

## Chatbot
- `POST /chatbot` - ask trading assistant `{ query }`

## Admin (admin JWT required)
- `GET /admin/users`
- `PATCH /admin/users/:id/role`
- `POST /admin/stocks`
- `PATCH /admin/stocks/:id`
- `GET /admin/analytics`

## WebSocket events
- Connect: `io(VITE_WS_URL)`
- Receive: `stock:update` payload `{symbol, name, price, change, volume, timestamp}`
