import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RutaPrivada({ children }) {
  const { usuario } = useAuth();
  const token = localStorage.getItem('token');

  if (!usuario && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
