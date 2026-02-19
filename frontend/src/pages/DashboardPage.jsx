import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { api } from '../api/client.js';
import ChatbotWidget from '../components/ChatbotWidget.jsx';
import StockChart from '../components/StockChart.jsx';
import StockTicker from '../components/StockTicker.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:5000', { autoConnect: false });

export default function DashboardPage() {
  const { token, user, setSession } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('TATA');
  const [stockHistory, setStockHistory] = useState([]);
  const [portfolio, setPortfolio] = useState({ balance: 0, holdings: [], totalInvested: 0, totalCurrent: 0 });
  const [orders, setOrders] = useState([]);
  const [trade, setTrade] = useState({ symbol: 'TATA', quantity: 1, type: 'buy' });

  const fetchDashboard = async () => {
    const [stocksRes, portfolioRes, ordersRes] = await Promise.all([
      api.get('/stocks'),
      api.get('/trade/portfolio', token),
      api.get('/trade/orders', token)
    ]);
    setStocks(stocksRes.data);
    setPortfolio(portfolioRes.data);
    setOrders(ordersRes.data);
  };

  const fetchSymbolData = async (symbol) => {
    const { data } = await api.get(`/stocks/${symbol}`);
    setStockHistory(data.history);
    setSelectedSymbol(symbol);
    setTrade((prev) => ({ ...prev, symbol }));
  };

  useEffect(() => {
    fetchDashboard();
    fetchSymbolData(selectedSymbol);

    socket.connect();
    socket.on('stock:update', (payload) => {
      setStocks((prev) => prev.map((stock) => (stock.symbol === payload.symbol ? { ...stock, currentPrice: payload.price, change: payload.change, volume: payload.volume } : stock)));
      if (payload.symbol === selectedSymbol) {
        setStockHistory((prev) => [...prev.slice(-80), { timestamp: payload.timestamp, price: payload.price }]);
      }
    });

    return () => {
      socket.off('stock:update');
      socket.disconnect();
    };
  }, []);

  const pnl = useMemo(() => Number((portfolio.totalCurrent - portfolio.totalInvested).toFixed(2)), [portfolio]);

  const submitOrder = async () => {
    const { data } = await api.post('/trade/orders', trade, token);
    setSession({ token, user: data.user });
    await fetchDashboard();
  };

  return (
    <div className="dashboard-grid">
      <section className="card stats">
        <h2>Portfolio Overview</h2>
        <div className="stats-row">
          <p>Balance: ₹{portfolio.balance?.toFixed(2)}</p>
          <p>Invested: ₹{portfolio.totalInvested?.toFixed(2)}</p>
          <p>Current: ₹{portfolio.totalCurrent?.toFixed(2)}</p>
          <p className={pnl >= 0 ? 'pos' : 'neg'}>P/L: ₹{pnl}</p>
        </div>
        <p>Welcome {user?.name}</p>
      </section>

      <StockTicker stocks={stocks} onSelect={fetchSymbolData} />
      <StockChart history={stockHistory} title={`${selectedSymbol} price`} />

      <section className="card trade-box">
        <h3>Buy / Sell Orders</h3>
        <input value={trade.symbol} onChange={(e) => setTrade((prev) => ({ ...prev, symbol: e.target.value.toUpperCase() }))} />
        <input type="number" min="1" value={trade.quantity} onChange={(e) => setTrade((prev) => ({ ...prev, quantity: Number(e.target.value) }))} />
        <select value={trade.type} onChange={(e) => setTrade((prev) => ({ ...prev, type: e.target.value }))}>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
        <button onClick={submitOrder}>Submit Order</button>
      </section>

      <section className="card">
        <h3>Open / Recent Orders</h3>
        <ul>
          {orders.slice(0, 8).map((order) => (
            <li key={order._id}>{order.type.toUpperCase()} {order.symbol} x{order.quantity} @ ₹{order.price}</li>
          ))}
        </ul>
      </section>

      <ChatbotWidget />
    </div>
  );
}
