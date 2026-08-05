import { Outlet, Link, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-73px)]">
      {/* Sub-navbar del Administrador */}
      <div className="border-b border-grafito bg-panel">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <Link
              to="/admin/usuarios"
              className={`text-sm font-medium transition ${
                isActive('/admin/usuarios') || isActive('/admin')
                  ? 'text-naranja border-b-2 border-naranja pb-1'
                  : 'text-hueso/70 hover:text-hueso'
              }`}
            >
              Usuarios
            </Link>
            <Link
              to="/admin/autos"
              className={`text-sm font-medium transition ${
                isActive('/admin/autos')
                  ? 'text-naranja border-b-2 border-naranja pb-1'
                  : 'text-hueso/70 hover:text-hueso'
              }`}
            >
              Autos (Global)
            </Link>
          </div>
          
          <Link
            to="/autos"
            className="flex items-center gap-2 text-sm font-medium text-hueso/70 hover:text-hueso transition hover:bg-grafito px-3 py-1.5 rounded-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Dashboard
          </Link>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 overflow-auto bg-chasis">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
