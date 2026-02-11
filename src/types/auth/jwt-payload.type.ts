import type { Admin } from './admin.type';

interface AdminClientToken extends Pick<Admin, 'id' | 'role' | 'localityId'> {
  sessionId: string;
}
interface PayloadAdminDataToken extends AdminClientToken {
  exp: number; // Tiempo de expiración (UNIX timestamp)
  iat: number; // Tiempo de emisión (UNIX timestamp)
}
type TokenValidate = 'client' | 'refresh';
interface RefreshTokenData {
  client: string;
  refresh: string;
}
export type {
  AdminClientToken,
  TokenValidate,
  RefreshTokenData,
  PayloadAdminDataToken,
};
