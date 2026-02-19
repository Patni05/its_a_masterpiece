import { useState } from 'react';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import StockChart from './StockChart.jsx';

export default function ChatbotWidget() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const { token } = useAuth();

  const ask = async () => {
    if (!query.trim()) return;
    const userQuestion = query;
    setMessages((prev) => [...prev, { role: 'user', text: userQuestion }]);
    setQuery('');

    const { data } = await api.post('/chatbot', { query: userQuestion }, token);
    setMessages((prev) => [...prev, { role: 'bot', text: data.text }]);
    setAnalytics(data.analytics || []);
  };

  return (
    <section className="card chatbot">
      <h3>AI Assistant</h3>
      <div className="chat-log">
        {messages.map((msg, idx) => (
          <p key={`${msg.role}-${idx}`} className={msg.role === 'user' ? 'u' : 'b'}>
            {msg.text}
          </p>
        ))}
      </div>
      <div className="chat-actions">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask about trading, P/L, Tata/Jio..." />
        <button onClick={ask}>Send</button>
      </div>
      {analytics.map((entry) => (
        <StockChart key={entry.symbol} history={entry.history} title={`${entry.symbol} (assistant)`} />
      ))}
    </section>
  );
}
