import type {
  WorkerAssignment as PrismaWorkerAssignment,
  Worker as PrismaWorker,
  WorkShift as PrismaWorkShift,
} from '../../../generated/prisma-locality';
import type {
  GenericResponse,
  GenericDataResponse,
  GenericPaginationResponse,
  PaginationRequest,
  Sorting,
  DecimalNumber,
} from 'src/types/common';
import type { SimpleWorkerResponse } from 'src/types/worker';
import type { SimpleWorkShiftResponse } from 'src/types/work-shift';

type WorkerAssignment = PrismaWorkerAssignment;
type WorkerAssignmentId = WorkerAssignment['id'];

type CreateWorkerAssignment = Omit<
  WorkerAssignment,
  'id' | 'createdAt' | 'localityId' | 'totalAmount' | 'date' | 'additionalPercent'
> & {
  date: string; // YYYY-MM-DD format
  additionalPercent?: DecimalNumber;
  // totalAmount se calcula automáticamente, no se incluye en el create
};

type UpdateWorkerAssignment = Partial<CreateWorkerAssignment>;

type WorkerAssignmentSortBy =
  | 'id'
  | 'date'
  | 'totalAmount'
  | 'createdAt';

interface FindWorkerAssignmentQuery
  extends Sorting<WorkerAssignmentSortBy>,
    PaginationRequest {
  workerId?: string;
  workShiftId?: string;
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string; // YYYY-MM-DD
  localityId?: string;
}

// Response type for transformed WorkerAssignment (Decimal → string, Date → string)
type SimpleWorkerAssignmentResponse = Omit<
  WorkerAssignment,
  'additionalPercent' | 'totalAmount' | 'date'
> & {
  date: string; // YYYY-MM-DD format
  additionalPercent: string;
  totalAmount: string;
};

// Response with relations
type WorkerAssignmentWithRelations = SimpleWorkerAssignmentResponse & {
  Worker: SimpleWorkerResponse;
  WorkShift: SimpleWorkShiftResponse;
};

// Response interface types
interface WorkerAssignmentCreatedResponse
  extends GenericDataResponse<SimpleWorkerAssignmentResponse> {}

interface WorkerAssignmentSingleResponse
  extends GenericDataResponse<WorkerAssignmentWithRelations> {}

interface WorkerAssignmentUpdatedResponse
  extends GenericDataResponse<SimpleWorkerAssignmentResponse> {}

interface AllWorkerAssignmentsResponse
  extends GenericPaginationResponse<SimpleWorkerAssignmentResponse[]> {}

export type {
  WorkerAssignment,
  WorkerAssignmentId,
  CreateWorkerAssignment,
  UpdateWorkerAssignment,
  WorkerAssignmentSortBy,
  FindWorkerAssignmentQuery,
  SimpleWorkerAssignmentResponse,
  WorkerAssignmentWithRelations,
  WorkerAssignmentCreatedResponse,
  WorkerAssignmentSingleResponse,
  WorkerAssignmentUpdatedResponse,
  AllWorkerAssignmentsResponse,
};
