import type { Agency as PrismaAgency } from '../../../generated/prisma-common';
import type { NullToUndefined } from '../common';

type Agency = PrismaAgency;
type AgencyId = Agency['id'];

type CreateAgency = NullToUndefined<
  Omit<Agency, 'id' | 'createdAt' | 'deletedAt'>
>;
type UpdateAgency = Partial<CreateAgency>;

interface FindAgenciesQuery {
  page?: number;
  limit?: number;
  sortBy?: AgencySortBy;
  sortOrder?: 'asc' | 'desc';
  name?: string;
}

type AgencySortBy = 'id' | 'name' | 'createdAt';

// Response types
interface AgencyCreatedResponse {
  success: boolean;
  message: string;
  data: Agency;
}

interface AgencyUpdatedResponse {
  success: boolean;
  message: string;
  data: Agency;
}

interface AgencyDeletedResponse {
  success: boolean;
  message: string;
}

interface AgencySingleResponse {
  success: boolean;
  message: string;
  data: Agency;
}

interface AllAgenciesResponse {
  success: boolean;
  message: string;
  data: Array<Agency>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ListAgenciesResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: string;
    name: string;
  }>;
}

export type {
  Agency,
  AgencyId,
  CreateAgency,
  UpdateAgency,
  FindAgenciesQuery,
  AgencySortBy,
  AgencyCreatedResponse,
  AgencyUpdatedResponse,
  AgencyDeletedResponse,
  AgencySingleResponse,
  AllAgenciesResponse,
  ListAgenciesResponse,
};
