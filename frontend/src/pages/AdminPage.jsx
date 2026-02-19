import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [stockForm, setStockForm] = useState({ symbol: '', name: '', sector: '', currentPrice: 10 });

  const load = async () => {
    const [usersRes, metricsRes] = await Promise.all([
      api.get('/admin/users', token),
      api.get('/admin/analytics', token)
    ]);
    setUsers(usersRes.data);
    setMetrics(metricsRes.data);
  };

  useEffect(() => {
    load();
  }, []);

  const createStock = async () => {
    await api.post('/admin/stocks', { ...stockForm, symbol: stockForm.symbol.toUpperCase() }, token);
    setStockForm({ symbol: '', name: '', sector: '', currentPrice: 10 });
  };

  return (
    <div className="dashboard-grid">
      <section className="card">
        <h2>Platform Analytics</h2>
        {metrics && (
          <div className="stats-row">
            <p>Users: {metrics.userCount}</p>
            <p>Orders: {metrics.orderCount}</p>
            <p>Stocks: {metrics.stockCount}</p>
            <p>Traded Volume: ₹{metrics.tradedVolume.toFixed(2)}</p>
          </div>
        )}
      </section>

      <section className="card">
        <h3>Manage Users</h3>
        <ul>
          {users.map((u) => (
            <li key={u._id}>{u.name} — {u.email} ({u.role})</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h3>Add Stock Listing</h3>
        <input placeholder="Symbol" value={stockForm.symbol} onChange={(e) => setStockForm((p) => ({ ...p, symbol: e.target.value }))} />
        <input placeholder="Name" value={stockForm.name} onChange={(e) => setStockForm((p) => ({ ...p, name: e.target.value }))} />
        <input placeholder="Sector" value={stockForm.sector} onChange={(e) => setStockForm((p) => ({ ...p, sector: e.target.value }))} />
        <input type="number" placeholder="Current Price" value={stockForm.currentPrice} onChange={(e) => setStockForm((p) => ({ ...p, currentPrice: Number(e.target.value) }))} />
        <button onClick={createStock}>Create Stock</button>
      </section>
    </div>
  );
}
