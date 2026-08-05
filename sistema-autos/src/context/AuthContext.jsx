import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });
  const [cargando, setCargando] = useState(false);

  async function login(email, password) {
    setCargando(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      setUsuario(data.usuario);
      return { ok: true };
    } catch (error) {
      const mensaje = error.response?.data?.error || 'No se pudo iniciar sesion.';
      return { ok: false, mensaje };
    } finally {
      setCargando(false);
    }
  }

  async function registrar(nombre, email, password) {
    setCargando(true);
    try {
      const { data } = await api.post('/auth/registro', { nombre, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      setUsuario(data.usuario);
      return { ok: true };
    } catch (error) {
      const mensaje = error.response?.data?.error || 'No se pudo crear la cuenta.';
      return { ok: false, mensaje };
    } finally {
      setCargando(false);
    }
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, registrar, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
