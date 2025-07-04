import { pool } from "../config/db.js";
import { UserQueries, TokenQueries } from "../utils/queries.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { v4 as uuidv4 } from "uuid";

/* ---------- Registro ---------- */
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    let role = req.body.role;

    // Verificar si ya existe un administrador
    const [[row]] = await pool.execute(
      `SELECT COUNT(*) AS total FROM users WHERE role = 'admin'`
    );

    // Lógica de asignación de roles mejorada
    if (row.total === 0 && role === "admin") {
      role = "admin"; // primer administrador del sistema
    } else if (req.user?.role === "admin" && role === "admin") {
      role = "admin"; // solo administradores pueden crear otros administradores
    } else {
      role = "user"; // valor por defecto
    }

    // Verificar si el email ya está registrado
    const [[existing]] = await pool.execute(UserQueries.getUserByEmail, [email]);
    if (existing) {
      return res.status(409).json({ 
        success: false,
        message: "Error de registro",
        details: "El email ya está registrado",
        error: "EMAIL_ALREADY_EXISTS"
      });
    }

    // Crear el nuevo usuario
    const userId = uuidv4();
    const passwordHash = await hashPassword(password);

    await pool.execute(UserQueries.createUser, [
      userId,
      name,
      email,
      passwordHash,
      role,
    ]);

    // Generar tokens
    const accessToken = signAccessToken({ id: userId, role });
    const refreshToken = signRefreshToken({ id: userId, role });

    // Guardar refresh token en la base de datos
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.execute(TokenQueries.insertRefreshToken, [
      userId,
      refreshToken,
      expiresAt,
    ]);

    return res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: {
        userId,
        name,
        email,
        role,
        registeredAt: new Date().toISOString()
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: "1h" // Tiempo de expiración del access token
      },
      details: `Usuario ${name} registrado con rol ${role}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: "Error en el proceso de registro",
      error: err.message,
      details: "Ocurrió un error al intentar registrar el usuario"
    });
  }
}

/* ---------- Login ---------- */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Credenciales incompletas",
        details: "Se requieren email y contraseña",
        error: "MISSING_CREDENTIALS"
      });
    }

    // Buscar usuario
    const [[user]] = await pool.execute(UserQueries.getUserByEmail, [email]);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Error de autenticación",
        details: "Credenciales inválidas",
        error: "INVALID_CREDENTIALS"
      });
    }

    // Verificar contraseña
    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({
        success: false,
        message: "Error de autenticación",
        details: "Credenciales inválidas",
        error: "INVALID_CREDENTIALS"
      });
    }

    // Generar tokens
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    // Guardar refresh token en la base de datos
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.execute(TokenQueries.insertRefreshToken, [
      user.id,
      refreshToken,
      expiresAt,
    ]);

    res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      data: {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      tokens: {
        accessToken,
        refreshToken,
        accessTokenExpiresIn: "1h",
        refreshTokenExpiresIn: "7d"
      },
      details: `Bienvenido ${user.name}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error en el inicio de sesión",
      error: err.message,
      details: "Ocurrió un error al intentar autenticar al usuario"
    });
  }
}

/* ---------- Refresh ---------- */
export async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;

    // Validar token presente
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Token requerido",
        details: "Se requiere un refresh token",
        error: "MISSING_TOKEN"
      });
    }

    // Verificar token
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(403).json({
        success: false,
        message: "Token inválido",
        details: "El refresh token proporcionado no es válido",
        error: "INVALID_TOKEN"
      });
    }

    // Verificar token en base de datos
    const [[tokenRow]] = await pool.execute(TokenQueries.getRefreshToken, [
      refreshToken,
    ]);
    if (!tokenRow) {
      return res.status(403).json({
        success: false,
        message: "Token revocado",
        details: "El refresh token ha sido revocado",
        error: "REVOKED_TOKEN"
      });
    }

    // Generar nuevo access token
    const accessToken = signAccessToken({ id: payload.id, role: payload.role });

    res.json({
      success: true,
      message: "Token actualizado exitosamente",
      data: {
        userId: payload.id,
        role: payload.role
      },
      tokens: {
        accessToken,
        expiresIn: "1h"
      },
      details: "Nuevo access token generado"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error al refrescar token",
      error: err.message,
      details: "Ocurrió un error al intentar refrescar el token de acceso"
    });
  }
}