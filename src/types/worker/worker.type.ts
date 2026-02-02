import type { Worker as PrismaWorker } from '../../../generated/prisma-locality';
import type {
  Company as PrismaCompany,
  Locality as PrismaLocality,
} from '../../../generated/prisma-common';
import type { NullToUndefined } from '../common';

type Worker = PrismaWorker;
type WorkerId = Worker['id'];

type CreateWorker = NullToUndefined<
  Omit<Worker, 'id' | 'createdAt' | 'deletedAt'>
>;
type UpdateWorker = Partial<CreateWorker>;

interface FindWorkersQuery {
  page?: number;
  limit?: number;
  sortBy?: WorkerSortBy;
  sortOrder?: 'asc' | 'desc';
  name?: string;
  surname?: string;
  dni?: string;
  companyId?: string; // UUID
  localityId?: string; // UUID
}

type WorkerSortBy =
  | 'id'
  | 'name'
  | 'surname'
  | 'dni'
  | 'companyId'
  | 'localityId'
  | 'baseHourlyRate'
  | 'createdAt';

// Response type for transformed Worker (Decimal → string)
type SimpleWorkerResponse = Omit<Worker, 'baseHourlyRate'> & {
  baseHourlyRate: string;
};

// Response types
interface WorkerCreatedResponse {
  success: boolean;
  message: string;
  data: SimpleWorkerResponse;
}

interface WorkerUpdatedResponse {
  success: boolean;
  message: string;
  data: SimpleWorkerResponse;
}

interface WorkerDeletedResponse {
  success: boolean;
  message: string;
}

interface WorkerSingleResponse {
  success: boolean;
  message: string;
  data: SimpleWorkerResponse & {
    Company: PrismaCompany | null;
    Locality: PrismaLocality;
  };
}

interface AllWorkersResponse {
  success: boolean;
  message: string;
  data: Array<
    SimpleWorkerResponse & {
      Company: PrismaCompany | null;
      Locality: PrismaLocality;
    }
  >;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ListWorkersResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: string;
    name: string;
    surname: string;
    dni: string;
  }>;
}

export type {
  Worker,
  WorkerId,
  CreateWorker,
  UpdateWorker,
  FindWorkersQuery,
  WorkerSortBy,
  SimpleWorkerResponse,
  WorkerCreatedResponse,
  WorkerUpdatedResponse,
  WorkerDeletedResponse,
  WorkerSingleResponse,
  AllWorkersResponse,
  ListWorkersResponse,
};
