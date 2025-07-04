import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../config/env.js';

export function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return next(); // no hay token, seguimos sin usuario
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(); // token mal formado, pero no bloqueamos
  }

  try {
    const user = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = user; // ← ponemos el user si es válido
  } catch {
    // Token inválido: no detenemos, pero tampoco ponemos req.user
  }

  next();
}