import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RutaAdmin({ children }) {
  const { usuario } = useAuth();
  const token = localStorage.getItem('token');

  // Si no hay usuario o token, redirige a la página de login.
  if (!token || !usuario) {
    return <Navigate to="/login" replace />;
  }
  
  // Si el usuario no es 'admin', redirige a la página principal de autos.
  if (usuario.rol !== 'admin') {
    return <Navigate to="/autos" replace />;
  }

  return children;
}
