import type { Admin as PrismaAdmin } from '../../../generated/prisma-common';
import type { PaginationRequest, Sorting } from '../common';
import type { Locality } from '../locality';

// IMPORTANTE: Prisma 7 tiene un bug donde el enum generado es { ADMIN: '1', LOCAL: '5' }
// pero en runtime Prisma devuelve "ADMIN" | "LOCAL" (las keys del enum, NO los valores mapeados)
// Por eso redefinimos AdminRole para que use las keys en vez de los valores de Prisma
const AdminRole = {
  ADMIN: 'ADMIN',
  LOCAL: 'LOCAL',
} as const;

type AdminTypeRole = (typeof AdminRole)[keyof typeof AdminRole];

// Redefinimos Admin para que use AdminTypeRole en lugar del Role de Prisma
type Admin = Omit<PrismaAdmin, 'role'> & {
  role: AdminTypeRole;
  Locality?: Locality | null;
};

type AdminId = Admin['id'];

type CreateAdmin = Partial<
  Omit<Admin, 'id' | 'createdAt' | 'deletedAt' | 'localityId'>
> & {
  name: string;
  surname: string;
  dni: string;
  password: string;
  role: AdminTypeRole;
  localityId?: string | null;
};

type UpdateAdmin = Partial<CreateAdmin>;

type LoginAdmin = Pick<Admin, 'dni' | 'password'>;

type AdminSortBy = keyof Omit<Admin, 'password'>;

interface FindAdminsQuery
  extends Sorting<AdminSortBy>,
    PaginationRequest,
    Partial<CreateAdmin> {}

export type {
  Admin,
  AdminId,
  CreateAdmin,
  UpdateAdmin,
  LoginAdmin,
  FindAdminsQuery,
  AdminSortBy,
  AdminTypeRole,
  PrismaAdmin,
};
export { AdminRole };
