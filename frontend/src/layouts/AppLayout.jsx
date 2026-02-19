import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>Tradex</h1>
        <nav>
          <Link to="/">Dashboard</Link>
          {user?.role === 'admin' && <Link to="/admin">Admin</Link>}
          <button
            onClick={() => {
              logout();
              navigate('/auth');
            }}
          >
            Logout
          </button>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
