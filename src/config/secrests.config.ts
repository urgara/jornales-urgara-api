import { registerAs } from '@nestjs/config';

export default registerAs('secrets', () => ({
  JWT_SECRET_CLIENT: process.env.JWT_SECRET_CLIENT,
  JWT_SECRET_REFRESH: process.env.JWT_SECRET_REFRESH,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  BUCKET_KEY_ID: process.env.BUCKET_KEY_ID,
  BUCKET_SECRET_ACCESS_KEY: process.env.BUCKET_SECRET_ACCESS_KEY,
  BUCKET_NAME: process.env.BUCKET_NAME,
}));
