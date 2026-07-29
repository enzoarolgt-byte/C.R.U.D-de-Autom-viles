# Sistema de Autos — CRUD con Login (React + Express + PostgreSQL)

Sistema full stack para gestionar autos, con autenticación de usuarios (JWT).

- **Frontend:** React + Vite + Tailwind CSS → desplegado en **Vercel**
- **Backend:** Node.js + Express + JWT + bcrypt → desplegado en **Railway**
- **Base de datos:** PostgreSQL → alojada en **Railway**

## Estructura del proyecto

```
sistema-autos/
├── backend/          # API REST (Express)
│   ├── server.js
│   └── src/
│       ├── db.js
│       ├── schema.sql
│       ├── middleware/auth.middleware.js
│       ├── controllers/
│       └── routes/
└── frontend/          # SPA (React + Tailwind)
    └── src/
        ├── api/axios.js
        ├── context/AuthContext.jsx
        ├── components/
        └── pages/
```

## 1. Requisitos previos

- Node.js 18+
- Cuenta en [GitHub](https://github.com)
- Cuenta en [Railway](https://railway.app)
- Cuenta en [Vercel](https://vercel.com)

## 2. Configurar Git y GitHub

Desde la carpeta raíz `sistema-autos/`:

```bash
git init
git add .
git commit -m "Sistema de autos: estructura inicial"
```

Crea un repositorio vacío en GitHub (sin README) y conéctalo:

```bash
git branch -M main
git remote add origin https://github.com/TU_USUARIO/sistema-autos.git
git push -u origin main
```

> Recomendación: usa dos repos separados (backend y frontend) o un monorepo como este.
> Si prefieres repos separados, simplemente haz `git init` dentro de cada carpeta
> (`backend/` y `frontend/`) y súbelos a dos repositorios distintos.

Flujo de trabajo sugerido con ramas:

```bash
git checkout -b feature/nombre-de-la-tarea
# ... haces cambios ...
git add .
git commit -m "Descripcion del cambio"
git push origin feature/nombre-de-la-tarea
# Luego abres un Pull Request hacia main en GitHub
```

## 3. Backend: correrlo en local

```bash
cd backend
cp .env.example .env
npm install
```

Edita `.env` con los datos de tu PostgreSQL local (o usa uno en la nube).
Luego crea las tablas ejecutando `src/schema.sql` en tu base de datos, por ejemplo:

```bash
psql "$DATABASE_URL" -f src/schema.sql
```

Levanta el servidor:

```bash
npm run dev
```

Prueba que responde: `http://localhost:4000/api/health`

## 4. Frontend: correrlo en local

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Abre `http://localhost:5173`, crea una cuenta en "Registro" y empieza a
agregar autos.

## 5. Desplegar el backend + base de datos en Railway

1. Entra a [railway.app](https://railway.app) y crea un **New Project**.
2. Elige **Deploy from GitHub repo** y selecciona tu repositorio (o la carpeta
   `backend` si usas un monorepo con Root Directory).
3. Agrega un plugin **PostgreSQL** al proyecto (`+ New` → `Database` →
   `PostgreSQL`). Railway generará automáticamente la variable `DATABASE_URL`.
4. En el servicio del backend, ve a **Variables** y agrega:
   - `JWT_SECRET` (una cadena larga y aleatoria)
   - `JWT_EXPIRES_IN` = `8h`
   - `FRONTEND_URL` = la URL que te dará Vercel (puedes actualizarla después)
   - Si tu repo es monorepo, define **Root Directory** = `backend` en Settings.
5. Railway detecta `npm start` automáticamente gracias al `package.json`.
6. Una vez desplegado, conecta a la base de datos (botón **Connect** en el
   plugin de PostgreSQL o usando `DATABASE_URL` desde tu máquina) y ejecuta
   `src/schema.sql` para crear las tablas.
7. Copia la URL pública que Railway asigna al backend
   (algo como `https://sistema-autos-backend.up.railway.app`).

## 6. Desplegar el frontend en Vercel

1. Entra a [vercel.com](https://vercel.com) → **Add New Project** → importa
   tu repositorio de GitHub.
2. Si usas monorepo, define **Root Directory** = `frontend`.
3. Framework preset: **Vite**.
4. En **Environment Variables**, agrega:
   - `VITE_API_URL` = `https://TU-BACKEND.up.railway.app/api`
5. Deploy. Vercel te dará una URL pública (ej.
   `https://sistema-autos.vercel.app`).
6. Regresa a Railway y actualiza la variable `FRONTEND_URL` del backend con
   esa URL de Vercel, para que CORS funcione correctamente. Railway
   redesplegará el servicio automáticamente.

## 7. Flujo de uso

1. El usuario entra a la app → pantalla de **Login**.
2. Si no tiene cuenta, va a **Registro** (crea usuario + contraseña con hash
   bcrypt) y recibe un token JWT.
3. El token se guarda en `localStorage` y se envía en cada petición
   (`Authorization: Bearer <token>`).
4. Ya autenticado, accede a `/autos`, donde puede **crear, ver, editar y
   eliminar** sus autos (CRUD completo, cada usuario solo ve los suyos).
5. Al cerrar sesión o expirar el token, se redirige al Login.

## 8. Endpoints de la API

| Método | Ruta                | Descripción                          | Auth |
|--------|---------------------|---------------------------------------|------|
| POST   | `/api/auth/registro`| Crear usuario                        | No   |
| POST   | `/api/auth/login`   | Iniciar sesión (devuelve token)      | No   |
| GET    | `/api/auth/perfil`  | Obtener datos del usuario actual     | Sí   |
| GET    | `/api/autos`        | Listar autos del usuario             | Sí   |
| GET    | `/api/autos/:id`    | Obtener un auto                      | Sí   |
| POST   | `/api/autos`        | Crear un auto                        | Sí   |
| PUT    | `/api/autos/:id`    | Actualizar un auto                   | Sí   |
| DELETE | `/api/autos/:id`    | Eliminar un auto                     | Sí   |

## 9. Siguientes pasos sugeridos

- Agregar recuperación de contraseña.
- Subir foto del auto (ej. usando un bucket externo, ya que Railway no
  persiste archivos subidos directamente).
- Agregar paginación y búsqueda en la tabla de autos.
- Escribir pruebas automatizadas (Jest + Supertest para el backend).
