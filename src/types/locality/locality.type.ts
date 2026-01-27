import type { Locality as PrismaLocality } from '../../../generated/prisma/client';

type Locality = PrismaLocality;

type CreateLocality = Omit<Locality, 'id' | 'createdAt' | 'deletedAt'>;

type UpdateLocality = Partial<CreateLocality>;

interface LocalityCreatedResponse {
  success: boolean;
  message: string;
  data: Locality;
}

interface LocalityUpdatedResponse {
  success: boolean;
  message: string;
  data: Locality;
}

interface LocalityDeletedResponse {
  success: boolean;
  message: string;
}

export type {
  Locality,
  CreateLocality,
  UpdateLocality,
  LocalityCreatedResponse,
  LocalityUpdatedResponse,
  LocalityDeletedResponse,
};
