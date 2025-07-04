# 📚 API REST para Biblioteca en Línea

Una API REST completa para un sistema de biblioteca en línea, construida con **Node.js** y **Express**, utilizando arquitectura **MVC** con autenticación **JWT**, control de roles y base de datos **MySQL**.

---

## 🚀 Características

- Arquitectura MVC bien estructurada  
- Autenticación JWT con access y refresh tokens  
- Base de datos MySQL con conexión mediante pool  
- Validación de datos con Zod  
- Seguridad reforzada con Helmet, CORS y Rate Limiting  
- Sistema de roles (admin/user)  
- Transacciones SQL para operaciones críticas  
- Manejo de errores robusto  
- ES6+ con import/export  
- Documentación completa de endpoints  

---

## 📁 Estructura del Proyecto

```
src/
├── config/
│   ├── db.js              # Configuración de la base de datos
│   └── env.js             # Variables de entorno
├── controllers/
│   ├── authController.js  # Controlador de autenticación
│   ├── authorController.js# Controlador de autores
│   ├── bookController.js  # Controlador de libros
│   └── loanController.js  # Controlador de préstamos
├── middlewares/
│   ├── authMiddleware.js  # Middleware de autenticación
│   ├── roleMiddleware.js  # Middleware de roles
│   ├── validateMiddleware.js # Middleware de validación
│   └── optionalAuth.js    # Autenticación opcional
├── routes/
│   ├── authRoutes.js      # Rutas de autenticación
│   ├── authorRoutes.js    # Rutas de autores
│   ├── bookRoutes.js      # Rutas de libros
│   ├── loanRoutes.js      # Rutas de préstamos
│   └── allRoutes.js       # Agrupador de rutas
├── utils/
│   ├── validators/        # Esquemas de validación
│   ├── jwt.js             # Utilidades JWT
│   ├── password.js        # Utilidades para contraseñas
│   └── queries.js         # Consultas SQL
└── index.js               # Punto de entrada de la aplicación
```

---

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd biblioteca-api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Server
PORT=3000

# Database
DB_HOST=localhost
DB_USER=usuario
DB_PASSWORD=contraseña
DB_NAME=nombre_basedatos

# JWT
ACCESS_TOKEN_SECRET=tu_super_secreto_jwt_muy_seguro
REFRESH_TOKEN_SECRET=tu_super_secreto_refresh_jwt_muy_seguro
ACCESS_TOKEN_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d
```

### 4. Ejecutar el servidor

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

---

## 📚 Endpoints de la API

### 🔐 Autenticación

#### POST `/api/auth/register` – Registrar un nuevo usuario

```json
{
  "name": "Usuario Ejemplo",
  "email": "usuario@example.com",
  "password": "contraseñaSegura123",
  "role": "user" // opcional
}
```

#### POST `/api/auth/login` – Iniciar sesión

```json
{
  "email": "usuario@example.com",
  "password": "contraseñaSegura123"
}
```

#### POST `/api/auth/refresh` – Renovar token

```json
{
  "refreshToken": "token_refresh_aqui"
}
```

---

### 📚 Libros

- `GET /api/books` – Obtener todos los libros (autenticación requerida)  
- `GET /api/books/:id` – Obtener libro por ID  
- `POST /api/books` – Crear libro (requiere rol **admin**)  
- `PUT /api/books/:id` – Actualizar libro (**admin**)  
- `DELETE /api/books/:id` – Eliminar libro (**admin**)  

```json
{
  "title": "El Principito",
  "author_id": "uuid-del-autor",
  "publish_year": 1943,
  "copies": 5
}
```

---

### ✍️ Autores

- `GET /api/authors` – Obtener todos los autores  
- `GET /api/authors/:id` – Obtener autor por ID  
- `POST /api/authors` – Crear autor (**admin**)  
- `PUT /api/authors/:id` – Actualizar autor (**admin**)  
- `DELETE /api/authors/:id` – Eliminar autor (**admin**)  

```json
{
  "name": "Gabriel García Márquez",
  "bio": "Escritor colombiano, premio Nobel de Literatura"
}
```

---

### 📖 Préstamos

- `GET /api/loans/my` – Obtener préstamos del usuario actual  
- `POST /api/loans` – Crear nuevo préstamo  
- `PUT /api/loans/:id/return` – Devolver libro  

```json
{
  "book_id": "uuid-del-libro",
  "due_date": "2024-12-31"
}
```

---

## 🔐 Autenticación

**Formato:**

```text
Authorization: Bearer <access_token>
```

**Roles disponibles:**

- `user`: Usuario lector  
- `admin`: Puede crear, editar, eliminar libros/autores  

**Tokens:**

- **Access Token**: expira en 1 hora  
- **Refresh Token**: expira en 7 días  

---

## 🛡️ Seguridad

- **Helmet**: Headers seguros  
- **CORS**: Control de acceso  
- **Rate Limiting**: 100 peticiones por 15 minutos  
- **JWT**: Autenticación sin estado  
- **bcrypt**: Hash de contraseñas  
- **Zod**: Validación de datos  
- **Transacciones SQL**: Operaciones críticas  

---

## 🚀 Ejemplos de Uso

### 1. Registrar usuario

```bash
curl -X POST http://localhost:3000/api/auth/register   -H "Content-Type: application/json"   -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "miContraseñaSegura"
  }'
```

### 2. Iniciar sesión

```bash
curl -X POST http://localhost:3000/api/auth/login   -H "Content-Type: application/json"   -d '{
    "email": "juan@example.com",
    "password": "miContraseñaSegura"
  }'
```

### 3. Obtener libros

```bash
curl -X GET http://localhost:3000/api/books   -H "Authorization: Bearer <tu_access_token>"
```

### 4. Pedir préstamo

```bash
curl -X POST http://localhost:3000/api/loans   -H "Content-Type: application/json"   -H "Authorization: Bearer <tu_access_token>"   -d '{
    "book_id": "uuid-libro",
    "due_date": "2024-12-31"
  }'
```

---

## 📝 Notas

- La base de datos debe tener las tablas: `users`, `books`, `authors`, `loans`, `refresh_tokens`
- Las contraseñas están hasheadas con `bcrypt`
- Los tokens se validan contra la base de datos
- Respuestas JSON consistentes
- Se usan transacciones para cambios críticos de inventario

---

## 🤝 Contribuir

1. Haz fork del proyecto  
2. Crea una rama: `git checkout -b feature/NuevaFuncionalidad`  
3. Commit: `git commit -m 'Añade nueva funcionalidad'`  
4. Push: `git push origin feature/NuevaFuncionalidad`  
5. Abre un Pull Request  

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT – Ver el archivo [LICENSE](./LICENSE) para más detalles.
