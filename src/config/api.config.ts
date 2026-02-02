import { registerAs } from '@nestjs/config';

export default registerAs('api', () => ({
  PORT: parseInt(process.env.PORT || '9000', 10),
  PROD: process.env.NODE_ENV === 'PROD',
  DEV: process.env.NODE_ENV === 'DEV',
  REQUEST_CLIENT_IP: 'REQUEST_CLIENT_IP',
  REQUEST_USER_AGENT: 'REQUEST_USER_AGENT',
  COOKIE_KEY_NAME: 'CLIENT_TOKEN',
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  // ID de localidad de esta instancia de la API (UUID)
  // IMPORTANTE: TODAS las instancias DEBEN tener LOCALITY_ID configurado
  // Los admins ADMIN globales (sin localityId) pueden acceder a cualquier instancia
  LOCALITY_ID: process.env.LOCALITY_ID || null,
}));
