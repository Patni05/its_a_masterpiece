import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('tradexToken'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('tradexUser') || 'null'));

  useEffect(() => {
    if (token) localStorage.setItem('tradexToken', token);
    else localStorage.removeItem('tradexToken');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('tradexUser', JSON.stringify(user));
    else localStorage.removeItem('tradexUser');
  }, [user]);

  const value = useMemo(
    () => ({
      token,
      user,
      setSession: ({ token: nextToken, user: nextUser }) => {
        setToken(nextToken);
        setUser(nextUser);
      },
      logout: () => {
        setToken(null);
        setUser(null);
      },
      refreshUser: async () => {
        if (!token) return;
        const { data } = await api.get('/auth/me', token);
        setUser(data);
      }
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
