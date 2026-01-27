import type { LegalEntity as PrismaLegalEntity } from '../../../generated/prisma/client';

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
