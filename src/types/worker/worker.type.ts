import type { Worker as PrismaWorker } from '../../../generated/prisma-locality';
import { Category } from '../../../generated/prisma-locality';
import type { NullToUndefined } from '../common';

type Worker = PrismaWorker;
type WorkerId = Worker['id'];

type CreateWorker = NullToUndefined<
  Omit<Worker, 'id' | 'createdAt' | 'deletedAt' | 'localityId'>
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
  localityId?: string; // UUID
}

type WorkerSortBy =
  | 'id'
  | 'name'
  | 'surname'
  | 'dni'
  | 'localityId'
  | 'category'
  | 'createdAt';

// Response type for Worker (no transformations needed now)
type SimpleWorkerResponse = Worker;

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
  data: SimpleWorkerResponse;
}

interface AllWorkersResponse {
  success: boolean;
  message: string;
  data: SimpleWorkerResponse[];
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

// Re-export enum from Prisma (only place where Prisma is imported directly)
export { Category };
