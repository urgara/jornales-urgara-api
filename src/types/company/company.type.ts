import type { Company as PrismaCompany } from '../../../generated/prisma-common';
import type { NullToUndefined } from '../common';

type Company = PrismaCompany;
type CompanyId = Company['id'];

type CreateCompany = NullToUndefined<
  Omit<Company, 'id' | 'createdAt' | 'deletedAt'>
>;
type UpdateCompany = Partial<CreateCompany>;

interface FindCompaniesQuery {
  page?: number;
  limit?: number;
  sortBy?: CompanySortBy;
  sortOrder?: 'asc' | 'desc';
  name?: string;
  cuit?: string;
}

type CompanySortBy = 'id' | 'name' | 'createdAt';

// Response types
interface CompanyCreatedResponse {
  success: boolean;
  message: string;
  data: Company;
}

interface CompanyUpdatedResponse {
  success: boolean;
  message: string;
  data: Company;
}

interface CompanyDeletedResponse {
  success: boolean;
  message: string;
}

interface CompanySingleResponse {
  success: boolean;
  message: string;
  data: Company;
}

interface AllCompaniesResponse {
  success: boolean;
  message: string;
  data: Company[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ListCompaniesResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: number;
    name: string;
  }>;
}

export type {
  Company,
  CompanyId,
  CreateCompany,
  UpdateCompany,
  FindCompaniesQuery,
  CompanySortBy,
  CompanyCreatedResponse,
  CompanyUpdatedResponse,
  CompanyDeletedResponse,
  CompanySingleResponse,
  AllCompaniesResponse,
  ListCompaniesResponse,
};
