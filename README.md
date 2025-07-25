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

## 📚 Formatos de Entrada y Salida (Libros)

### Crear libro (POST /api/books)

**JSON de entrada:**
```json
{
  "title": "El Principito",
  "author_id": "uuid-del-autor",
  "publish_year": 1943,
  "copies": 5,
  "cover_url": "https://ejemplo.com/portada.jpg" // opcional
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Libro creado exitosamente",
  "data": {
    "id": "uuid-generado",
    "title": "El Principito",
    "author_id": "uuid-del-autor",
    "publish_year": 1943,
    "copies": 5,
    "cover_url": "https://ejemplo.com/portada.jpg",
    "status": "active"
  },
  "details": "El libro \"El Principito\" ha sido registrado en el sistema con 5 copias disponibles"
}
```

### Actualizar libro (PUT /api/books/:id)

**JSON de entrada:**
```json
{
  "title": "Nuevo Título", // opcional
  "author_id": "uuid-nuevo-autor", // opcional
  "publish_year": 2000, // opcional
  "copies": 10, // opcional
  "cover_url": "https://ejemplo.com/nueva-portada.jpg" // opcional
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Libro actualizado exitosamente",
  "data": {
    "id": "uuid-libro",
    "title": "Nuevo Título",
    "author_id": "uuid-nuevo-autor",
    "publish_year": 2000,
    "copies": 10,
    "cover_url": "https://ejemplo.com/nueva-portada.jpg",
    // ...otros campos
  },
  "changes": {
    "title": { "from": "El Principito", "to": "Nuevo Título" },
    "author_id": { "from": "uuid-anterior", "to": "uuid-nuevo-autor" },
    "publish_year": { "from": 1943, "to": 2000 },
    "copies": { "from": 5, "to": 10 },
    "cover_url": { "from": "https://ejemplo.com/portada.jpg", "to": "https://ejemplo.com/nueva-portada.jpg" }
  },
  "details": "El libro \"El Principito\" (ID: uuid-libro) ha sido actualizado"
}
```

### Obtener libro (GET /api/books/:id)

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Libro obtenido exitosamente",
  "data": {
    "id": "uuid-libro",
    "title": "El Principito",
    "author_id": "uuid-del-autor",
    "publish_year": 1943,
    "copies": 5,
    "cover_url": "https://ejemplo.com/portada.jpg",
  },
  "details": "Detalles del libro \"El Principito\" (ID: uuid-libro)"
}
```

### Eliminar libro (DELETE /api/books/:id)

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Libro eliminado exitosamente",
  "deletedBook": {
    "id": "uuid-libro",
    "title": "El Principito",
    "author_id": "uuid-del-autor"
  },
  "details": "El libro \"El Principito\" (ID: uuid-libro) ha sido eliminado del sistema"
}
```

---

## 📋 Formatos de Entrada y Salida (Autores)

### Crear autor (POST /api/authors)
**JSON de entrada:**
```json
{
  "name": "Gabriel García Márquez",
  "bio": "Escritor colombiano, premio Nobel de Literatura" // opcional
}
```
**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Autor creado exitosamente",
  "data": {
    "id": "uuid-generado",
    "name": "Gabriel García Márquez",
    "bio": "Escritor colombiano, premio Nobel de Literatura",
    "status": "active"
  },
  "details": "El autor \"Gabriel García Márquez\" ha sido registrado en el sistema"
}
```

### Actualizar autor (PUT /api/authors/:id)
**JSON de entrada:**
```json
{
  "name": "Nuevo Nombre", // opcional
  "bio": "Nueva biografía" // opcional
}
```
**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Autor actualizado exitosamente",
  "data": {
    "id": "uuid-autor",
    "name": "Nuevo Nombre",
    "bio": "Nueva biografía"
  },
  "changes": {
    "name": { "from": "Gabriel García Márquez", "to": "Nuevo Nombre" },
    "bio": { "from": "Biografía anterior", "to": "Nueva biografía" }
  },
  "details": "El autor \"Gabriel García Márquez\" (ID: uuid-autor) ha sido actualizado"
}
```

### Obtener autor (GET /api/authors/:id)
**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Autor obtenido exitosamente",
  "data": {
    "id": "uuid-autor",
    "name": "Gabriel García Márquez",
    "bio": "Escritor colombiano, premio Nobel de Literatura"
  },
  "details": "Detalles del autor \"Gabriel García Márquez\" (ID: uuid-autor)",
  "booksCount": 3
}
```

### Eliminar autor (DELETE /api/authors/:id)
**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Autor eliminado exitosamente",
  "deletedAuthor": {
    "id": "uuid-autor",
    "name": "Gabriel García Márquez",
    "booksCount": 3
  },
  "details": "El autor \"Gabriel García Márquez\" (ID: uuid-autor) ha sido eliminado del sistema",
  "warning": "Este autor tenía libros asociados. Verifique el estado de los mismos."
}
```

### Errores de validación (Zod)
```json
{
  "errors": {
    "name": "El nombre es obligatorio"
  }
}
```

### Errores de recursos no encontrados
```json
{
  "success": false,
  "message": "Autor no encontrado",
  "details": "No existe un autor con ID uuid-inexistente"
}
```

### Errores internos del servidor
```json
{
  "success": false,
  "message": "Error al crear autor",
  "error": "Mensaje técnico del error",
  "details": "Ocurrió un error al intentar registrar el nuevo autor"
}
```

---

## 📋 Formatos de Entrada y Salida (Préstamos)

### Crear préstamo (POST /api/loans)
**JSON de entrada:**
```json
{
  "book_id": "uuid-del-libro",
  "due_date": "2024-12-31"
}
```
**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Préstamo registrado exitosamente",
  "data": {
    "loanId": 1,
    "bookId": "uuid-del-libro",
    "bookTitle": "El Principito",
    "userId": "uuid-usuario",
    "dueDate": "2024-12-31",
    "status": "active",
    "availableCopies": 4
  }
}
```

### Devolver libro (PUT /api/loans/:id/return)
**JSON de entrada:**
```json
{
  "return_date": "2024-12-20"
}
```
**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Libro devuelto exitosamente",
  "data": {
    "loanId": 1,
    "bookId": "uuid-del-libro",
    "bookTitle": "El Principito",
    "returnDate": "2024-12-20",
    "availableCopies": 5,
    "status": "returned"
  }
}
```

### Obtener préstamos del usuario (GET /api/loans/my)
**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Préstamos obtenidos exitosamente",
  "count": 2,
  "data": [
    {
      "id": 1,
      "book_id": "uuid-del-libro",
      "loan_date": "2024-01-01T00:00:00.000Z",
      "due_date": "2024-12-31T00:00:00.000Z",
      "return_date": null,
      "title": "El Principito"
    }
  ],
  "details": "Se encontraron 2 préstamo(s) para el usuario con ID uuid-usuario"
}
```

### Errores de validación (Zod)
```json
{
  "errors": {
    "book_id": "El libro es obligatorio",
    "due_date": "Fecha no válida"
  }
}
```

### Errores de recursos no encontrados o sin stock
```json
{
  "success": false,
  "message": "Libro no encontrado",
  "details": "No existe un libro con ID uuid-inexistente"
}
```
```json
{
  "success": false,
  "message": "Sin copias disponibles",
  "details": {
    "bookId": "uuid-del-libro",
    "title": "El Principito",
    "availableCopies": 0
  }
}
```

### Errores internos del servidor
```json
{
  "success": false,
  "message": "Error al crear préstamo",
  "error": "Mensaje técnico del error"
}
```

---

## 📋 Formatos de Entrada y Salida (Autenticación)

### Registro de usuario (POST /api/auth/register)
**JSON de entrada:**
```json
{
  "name": "Usuario Ejemplo",
  "email": "usuario@example.com",
  "password": "contraseñaSegura123",
  "role": "user" // opcional
}
```
**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "userId": "uuid-generado",
    "name": "Usuario Ejemplo",
    "email": "usuario@example.com",
    "role": "user",
    "registeredAt": "2024-06-01T12:00:00.000Z"
  },
  "tokens": {
    "accessToken": "...",
    "refreshToken": "...",
    "expiresIn": "1h"
  },
  "details": "Usuario Usuario Ejemplo registrado con rol user"
}
```

### Login (POST /api/auth/login)
**JSON de entrada:**
```json
{
  "email": "usuario@example.com",
  "password": "contraseñaSegura123"
}
```
**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "userId": "uuid-generado",
    "name": "Usuario Ejemplo",
    "email": "usuario@example.com",
    "role": "user"
  },
  "tokens": {
    "accessToken": "...",
    "refreshToken": "...",
    "accessTokenExpiresIn": "1h",
    "refreshTokenExpiresIn": "7d"
  },
  "details": "Bienvenido Usuario Ejemplo"
}
```

### Renovar token (POST /api/auth/refresh)
**JSON de entrada:**
```json
{
  "refreshToken": "token_refresh_aqui"
}
```
**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Token actualizado exitosamente",
  "data": {
    "userId": "uuid-generado",
    "role": "user"
  },
  "tokens": {
    "accessToken": "...",
    "expiresIn": "1h"
  },
  "details": "Nuevo access token generado"
}
```

### Errores de validación (Zod)
```json
{
  "errors": {
    "email": "Email inválido",
    "password": "La contraseña es obligatoria"
  }
}
```

### Errores de autenticación y registro
```json
{
  "success": false,
  "message": "Error de autenticación",
  "details": "Credenciales inválidas",
  "error": "INVALID_CREDENTIALS"
}
```
```json
{
  "success": false,
  "message": "Error de registro",
  "details": "El email ya está registrado",
  "error": "EMAIL_ALREADY_EXISTS"
}
```

### Errores internos del servidor
```json
{
  "success": false,
  "message": "Error en el proceso de registro",
  "error": "Mensaje técnico del error",
  "details": "Ocurrió un error al intentar registrar el usuario"
}
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
