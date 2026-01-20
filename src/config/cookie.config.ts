import type { CookieOptions } from 'express';
import apiConfig from './api.config';

export const COOKIE_CONFIG: CookieOptions = {
  httpOnly: true, // Evita acceso JavaScript
  secure: apiConfig().PROD, // Solo para HTTPS
  maxAge: 24 * 60 * 60 * 1000, // Expira en 1 día
  sameSite: apiConfig().PROD ? 'none' : 'lax',
};
