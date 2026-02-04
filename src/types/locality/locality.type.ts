import type { Locality as PrismaLocality } from '../../../generated/prisma-common';
import type { PaginationRequest, Sorting } from '../common';

// Exclude databaseName from public API - it's internal only
type Locality = Omit<PrismaLocality, 'databaseName'>;
type LocalityId = Locality['id'];

type CreateLocality = Omit<Locality, 'id' | 'createdAt' | 'deletedAt'>;

type UpdateLocality = Partial<CreateLocality>;

type LocalitySortBy = keyof Locality;

interface FindLocalitiesQuery
  extends Sorting<LocalitySortBy>,
    PaginationRequest,
    Partial<Pick<Locality, 'name' | 'province'>> {}

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
  LocalityId,
  CreateLocality,
  UpdateLocality,
  LocalitySortBy,
  FindLocalitiesQuery,
  LocalityCreatedResponse,
  LocalityUpdatedResponse,
  LocalityDeletedResponse,
};
