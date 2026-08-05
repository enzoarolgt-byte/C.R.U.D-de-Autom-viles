import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="border-b border-grafito bg-panel">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link to="/autos" className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-naranja" />
            <h1 className="font-display text-lg font-semibold tracking-tight">
              Sistema de Autos
            </h1>
          </Link>
          {usuario && usuario.rol === 'admin' && (
            <Link
              to="/admin"
              className="text-sm font-medium text-hueso transition hover:text-naranja"
            >
              Panel Admin
            </Link>
          )}
        </div>
        {usuario && (
          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-sm text-hueso/70 sm:inline">
              {usuario.email}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-md border border-grafito px-3 py-1.5 text-sm font-medium text-hueso transition hover:border-naranja hover:text-naranja"
            >
              Cerrar sesion
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
