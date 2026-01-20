import type { Admin as PrismaAdmin } from '../../../generated/prisma/client';
import type { PaginationRequest, Sorting } from '../common';

// IMPORTANTE: Prisma 7 tiene un bug donde el enum generado es { ADMIN: '1', JORNAL: '5', PAYMENTS: '10' }
// pero en runtime Prisma devuelve "ADMIN" | "JORNAL" | "PAYMENTS" (las keys del enum, NO los valores mapeados)
// Por eso redefinimos AdminRole para que use las keys en vez de los valores de Prisma
const AdminRole = {
  ADMIN: 'ADMIN',
  JORNAL: 'JORNAL',
  PAYMENTS: 'PAYMENTS',
} as const;

type AdminTypeRole = (typeof AdminRole)[keyof typeof AdminRole];

// Redefinimos Admin para que use AdminTypeRole en lugar del Role de Prisma
type Admin = Omit<PrismaAdmin, 'role'> & {
  role: AdminTypeRole;
};

type AdminId = Admin['id'];

type CreateAdmin = Omit<Admin, 'id' | 'createdAt' | 'deletedAt'>;

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
