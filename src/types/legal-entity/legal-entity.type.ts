// NOTA: LegalEntity fue eliminado del schema de Prisma
// Este archivo se mantiene comentado para referencia futura
// Si necesitas reactivar LegalEntity, debes:
// 1. Agregarlo al schema prisma-global/schema.prisma
// 2. Ejecutar pnpm prisma generate
// 3. Descomentar este archivo

/*
import type { LegalEntity as PrismaLegalEntity } from '../../../generated/prisma-common';

type LegalEntity = PrismaLegalEntity;
type LegalEntityId = LegalEntity['id'];

// Response types
interface ListLegalEntitiesResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: number;
    abbreviation: string;
    description: string;
  }>;
}

export type {
  LegalEntity,
  LegalEntityId,
  ListLegalEntitiesResponse,
};
*/

export type {};
