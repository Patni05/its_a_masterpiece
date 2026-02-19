import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', token: '', newPassword: '' });
  const [feedback, setFeedback] = useState('');
  const { setSession } = useAuth();
  const navigate = useNavigate();

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'signup') {
        const { data } = await api.post('/auth/signup', {
          name: form.name,
          email: form.email,
          password: form.password
        });
        setSession(data);
      }
      if (mode === 'login') {
        const { data } = await api.post('/auth/login', { email: form.email, password: form.password });
        setSession(data);
      }
      if (mode === 'forgot') {
        const { data } = await api.post('/auth/forgot-password', { email: form.email });
        setFeedback(`Reset token: ${data.resetToken}`);
        return;
      }
      if (mode === 'reset') {
        const { data } = await api.post('/auth/reset-password', {
          token: form.token,
          newPassword: form.newPassword
        });
        setFeedback(data.message);
        return;
      }
      navigate('/');
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={submit}>
        <h2>{mode.toUpperCase()}</h2>
        {mode === 'signup' && <input placeholder="Name" value={form.name} onChange={(e) => update('name', e.target.value)} />}
        {(mode === 'signup' || mode === 'login' || mode === 'forgot') && (
          <input placeholder="Email" value={form.email} onChange={(e) => update('email', e.target.value)} />
        )}
        {(mode === 'signup' || mode === 'login') && (
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => update('password', e.target.value)} />
        )}
        {mode === 'reset' && (
          <>
            <input placeholder="Reset token" value={form.token} onChange={(e) => update('token', e.target.value)} />
            <input type="password" placeholder="New password" value={form.newPassword} onChange={(e) => update('newPassword', e.target.value)} />
          </>
        )}
        <button type="submit">Continue</button>
        {feedback && <p>{feedback}</p>}
        <div className="auth-modes">
          {['login', 'signup', 'forgot', 'reset'].map((m) => (
            <button key={m} type="button" onClick={() => setMode(m)}>
              {m}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
