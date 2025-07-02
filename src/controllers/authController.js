import { pool } from '../config/db.js';
import { UserQueries, TokenQueries } from '../utils/queries.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from '../utils/jwt.js';
import { v4 as uuidv4 } from 'uuid';

/* ---------- Registro ---------- */
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const [[existing]] = await pool.execute(UserQueries.getUserByEmail, [email]);
    if (existing) return res.status(409).json({ message: 'Email ya registrado' });

    const userId = uuidv4();
    const passwordHash = await hashPassword(password);

    await pool.execute(UserQueries.createUser,
      [userId, name, email, passwordHash, 'user']);

    return res.status(201).json({ message: 'Usuario creado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar' });
  }
}

/* ---------- Login ---------- */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const [[user]] = await pool.execute(UserQueries.getUserByEmail, [email]);
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: 'Credenciales inválidas' });

    const accessToken  = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.execute(TokenQueries.insertRefreshToken,
      [user.id, refreshToken, expiresAt]);

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
}

/* ---------- Refresh ---------- */
export async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Token requerido' });

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return res.status(403).json({ message: 'Token inválido' });
    }

    const [[tokenRow]] = await pool.execute(TokenQueries.getRefreshToken, [refreshToken]);
    if (!tokenRow) return res.status(403).json({ message: 'Token revocado' });

    const accessToken = signAccessToken({ id: payload.id, role: payload.role });
    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al refrescar token' });
  }
}