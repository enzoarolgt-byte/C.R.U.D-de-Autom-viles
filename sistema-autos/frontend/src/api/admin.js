import api from './axios';

/**
 * Obtiene la lista de todos los usuarios.
 * Esta funcion solo puede ser ejecutada por un administrador.
 * @returns {Promise<Array>} La lista de usuarios.
 */
export const obtenerUsuarios = async () => {
  try {
    const { data } = await api.get('/auth/usuarios');
    return data;
  } catch (error) {
    // Lanza el error para que el componente que llama pueda manejarlo.
    throw new Error(error.response?.data?.error || 'Error al obtener los usuarios');
  }
};
export const cambiarRolUsuario = async (id, rol) => {
  try {
    const { data } = await api.put(`/auth/usuarios/${id}/rol`, { rol });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al cambiar rol del usuario');
  }
};

export const eliminarUsuario = async (id) => {
  try {
    const { data } = await api.delete(`/auth/usuarios/${id}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al eliminar usuario');
  }
};

export const obtenerTodosAutosAdmin = async () => {
  try {
    const { data } = await api.get('/autos/admin/todos');
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al obtener autos globalmente');
  }
};

export const eliminarAutoAdmin = async (id) => {
  try {
    const { data } = await api.delete(`/autos/admin/${id}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error al eliminar auto globalmente');
  }
};
