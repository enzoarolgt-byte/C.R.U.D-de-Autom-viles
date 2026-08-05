import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Autos from './pages/Autos';
import RutaPrivada from './components/RutaPrivada';
import UsuariosPage from './pages/Usuarios.jsx';
import AdminAutos from './pages/AdminAutos.jsx';
import RutaAdmin from './components/RutaAdmin.jsx';
import AdminLayout from './components/AdminLayout.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route
        path="/autos"
        element={
          <RutaPrivada>
            <Autos />
          </RutaPrivada>
        }
      />
      
      {/* Rutas de Administrador (Anidadas en AdminLayout) */}
      <Route
        path="/admin"
        element={
          <RutaAdmin>
            <AdminLayout />
          </RutaAdmin>
        }
      >
        {/* Redirigir /admin a /admin/usuarios por defecto */}
        <Route index element={<Navigate to="usuarios" replace />} />
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="autos" element={<AdminAutos />} />
      </Route>

      <Route path="/" element={<Navigate to="/autos" replace />} />
      <Route path="*" element={<Navigate to="/autos" replace />} />
    </Routes>
  );
}
