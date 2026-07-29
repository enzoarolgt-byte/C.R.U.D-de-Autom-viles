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
        <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-3">
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
