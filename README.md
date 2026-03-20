# Frontend Proyecto Venta

Aplicacion Angular para registro/login, seleccion de grupos, modulo de administracion y gestion de archivo PDF por usuario.

## Stack

- Angular 20 (standalone components)
- TypeScript
- Bootstrap 5
- HttpClient para consumo de API

## Requisitos

- Node.js 18 o superior
- npm 9 o superior
- Backend corriendo en http://localhost:3000

## Adaptacion para Docker en Linux

Se crearon los archivos docker-compose.yaml, Dockerfile y nginx.conf en la parte frontend para adaptar su ejecucion en un entorno Linux con Docker instalado.

Estos archivos permiten construir y levantar la aplicacion frontend dentro de contenedores, usando Nginx para servir el build generado de Angular.

Aunque en este repositorio se encuentren dentro de la carpeta archivos adicionales/frontend_dockerizado, al momento de ejecutar Docker los tres archivos deben estar adyacentes al directorio frontend_proyecto_venta-main.

Estructura esperada:

```text
frontend_asociacion/
|-- frontend_proyecto_venta-main/
|-- docker-compose.yaml
|-- Dockerfile
`-- nginx.conf
```

Para su levantamiento se ejecuto el siguiente comando:

```bash
docker-compose up --build -d
```

## Instalacion y ejecucion

```bash
npm install
npm start
```

App local por defecto: http://localhost:4200

## Scripts disponibles

```bash
npm start      # ng serve
npm run build  # ng build
npm test       # ng test
```

## Configuracion de API

Archivo de entorno: src/environments/environment.ts

Valor actual:

```ts
export const environment = {
	apiUrl: 'http://localhost:3000',
};
```

## Docker Compose para PostgreSQL (Linux y Windows)

En este proyecto hay 2 archivos YAML para levantar PostgreSQL:

- Linux: archivos adicionales/docker-compose.yaml
- Windows: archivos adicionales/docker-compose.yamlversionwindows

### 1) Crear la red Docker externa (una sola vez)

```bash
docker network create --driver bridge --subnet 172.16.0.0/24 red-postgres
```

### 2) Crear carpetas para datos y backups

Linux:

```bash
sudo mkdir -p /postgres_data /postgres_backups
sudo chmod -R 777 /postgres_data /postgres_backups
```

Windows (PowerShell):

```powershell
New-Item -ItemType Directory -Force C:/Users/marco/OneDrive/Documentos/postgres_data
New-Item -ItemType Directory -Force C:/Users/marco/OneDrive/Documentos/postgres_backups
```

### 3) Levantar contenedor segun sistema operativo

Linux:

```bash
docker compose up -d 
```

Windows:

```cmd como administrador con docker desktop instalado
docker compose up -d
```

### 4) Validar que PostgreSQL esta arriba

```bash
docker ps
docker logs -f postgres_db
```

### 5) Crear base y restaurar dump

Entrar al contenedor:

```bash
docker exec -it postgres_db sh
```

Dentro del contenedor:

```bash
psql -U postgres -c "CREATE DATABASE asociacion;"
pg_restore -U postgres -h localhost -p 5432 -d asociacion -F c /backups/bd_ASOCIACION.dump
```

Nota: copia previamente el archivo bd_ASOCIACION.dump a la carpeta de backups configurada en tu YAML.

## Estructura principal

- src/app/app.routes.ts: definicion de rutas.
- src/app/login/: autenticacion.
- src/app/register/: registro de usuario.
- src/app/group-selection/: selector de grupos por usuario.
- src/app/admin/: gestion administrativa (usuarios y grupos).
- src/app/group-a/, src/app/group-b/, src/app/group-c/: vistas por grupo con tabs, upload PDF y cambio de password.

## Rutas frontend

- / redirige a /register
- /register registro de usuario
- /login inicio de sesion
- /select-group seleccion de grupo del usuario
- /group-a vista de Grupo A
- /group-b vista de Grupo B
- /group-c vista de Grupo C
- /admin panel de administracion (segun rol guardado en localStorage)

## Flujo funcional

1. Usuario se registra en /register.
2. Usuario inicia sesion en /login.
3. Se guarda token y role en localStorage.
4. Se redirige a /select-group.
5. El usuario entra a su grupo asignado (A, B o C).
6. Dentro del grupo puede ver secciones, subir/retirar PDF y cambiar contraseña.
7. Si el rol es admin, puede entrar a /admin para gestionar usuarios y grupos.

## Integracion con backend_

Endpoints usados desde frontend:

- POST /api/register
- POST /api/login
- GET /api/groups
- GET /api/users (admin)
- GET /api/all-groups (admin)
- GET /api/users/:userId/groups (admin)
- PUT /api/users/:id/group (admin)
- DELETE /api/users/:userId/group/:groupId (admin)
- PUT /api/users/:id/password (admin)
- DELETE /api/users/:id (admin)
- POST /api/subir-pdf
- GET /api/user-files
- DELETE /api/user-files/:id
- PUT /api/change-password

Importante para el panel admin:

- El valor de apiUrl debe quedar como base del backend, por ejemplo: http://localhost:3000
- Las llamadas del modulo admin deben incluir prefijo /api (ejemplo: /api/all-groups, /api/users)

Todos los endpoints protegidos envian el token como:

```http
Authorization: Bearer <token>
```

## Troubleshooting

### Error: Cannot GET /all-groups

Causa comun: el frontend esta llamando sin el prefijo /api.

Revision rapida:

- Correcto: http://localhost:3000/api/all-groups
- Incorrecto: http://localhost:3000/all-groups

Si aparece este error, revisa las llamadas HTTP del modulo admin y confirma que todas usen /api.

## Estado de sesion

Se usa localStorage con las claves token y role.
En logout se eliminan ambas.

## Mejoras recomendadas

- Reemplazar alert() por notificaciones UI.
- Implementar guardas de ruta (CanActivate) para proteger vistas por token/rol.
- Añadir interceptores HTTP para adjuntar token automaticamente.