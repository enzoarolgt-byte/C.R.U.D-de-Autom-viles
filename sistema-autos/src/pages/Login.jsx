import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, cargando } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const resultado = await login(email, password);
    if (resultado.ok) {
      navigate('/autos');
    } else {
      setError(resultado.mensaje);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-3 block h-2.5 w-2.5 rounded-full bg-naranja" />
          <h1 className="font-display text-2xl font-semibold tracking-tight">Iniciar sesion</h1>
          <p className="mt-1 text-sm text-hueso/60">Accede al sistema de gestion de autos</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg border border-grafito bg-panel p-6"
        >
          {error && (
            <p className="rounded-md bg-naranja/10 px-3 py-2 text-sm text-naranja">{error}</p>
          )}

          <label className="block text-sm">
            <span className="mb-1 block text-hueso/70">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-grafito bg-chasis px-3 py-2 outline-none focus:border-acero"
              placeholder="tucorreo@ejemplo.com"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-hueso/70">Contraseña</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-grafito bg-chasis px-3 py-2 outline-none focus:border-acero"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-md bg-naranja py-2 font-semibold text-white transition hover:bg-naranja/90 disabled:opacity-60"
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-hueso/60">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-acero hover:underline">
            Crea una aqui
          </Link>
        </p>
      </div>
    </div>
  );
}
