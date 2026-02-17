import type {
  WorkerAssignment as PrismaWorkerAssignment,
  WorkerAssignmentDetail as PrismaWorkerAssignmentDetail,
} from '../../../generated/prisma-locality';
import type {
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

type WorkerAssignmentDetail = PrismaWorkerAssignmentDetail;
type WorkerAssignmentDetailId = WorkerAssignmentDetail['id'];

type CreateWorkerAssignmentWorker = {
  workerId: string;
  category: WorkerAssignmentDetail['category'];
  value: {
    workShiftBaseValueId: string;
    coefficient: DecimalNumber;
  };
  additionalPercent?: DecimalNumber;
};

type CreateWorkerAssignment = Omit<
  WorkerAssignment,
  'id' | 'createdAt' | 'localityId' | 'date' | 'jc'
> & {
  date: string; // YYYY-MM-DD format
  jc?: boolean; // Jornal caído (default false)
  workers: CreateWorkerAssignmentWorker[];
};

type UpdateWorkerAssignment = Partial<
  Omit<CreateWorkerAssignment, 'workers'>
> & {
  workers?: CreateWorkerAssignmentWorker[];
};

type WorkerAssignmentSortBy =
  | 'id'
  | 'workShiftId'
  | 'date'
  | 'companyId'
  | 'companyRole'
  | 'terminalId'
  | 'productId'
  | 'shipId'
  | 'createdAt';

interface FindWorkerAssignmentQuery
  extends Sorting<WorkerAssignmentSortBy>,
    PaginationRequest {
  workerId?: string;
  workShiftId?: string;
  companyId?: string;
  companyRole?: string;
  terminalId?: string;
  productId?: string;
  shipId?: string;
  dateFrom?: string; // YYYY-MM-DD
  dateTo?: string; // YYYY-MM-DD
  localityId?: string;
}

// Response type for a single detail row (Decimal → string)
type SimpleWorkerAssignmentDetailResponse = Omit<
  WorkerAssignmentDetail,
  'coefficient' | 'baseValue' | 'additionalPercent' | 'totalAmount'
> & {
  coefficient: string;
  baseValue: string;
  additionalPercent: string | null;
  totalAmount: string;
};

// Detail response with nested Worker
type WorkerAssignmentDetailWithWorker = SimpleWorkerAssignmentDetailResponse & {
  Worker: SimpleWorkerResponse;
};

// Response type for transformed WorkerAssignment header + workers
type SimpleWorkerAssignmentResponse = Omit<WorkerAssignment, 'date'> & {
  date: string; // YYYY-MM-DD format
  shipName: string;
  workers: SimpleWorkerAssignmentDetailResponse[];
};

// Response with relations (workers include Worker, plus WorkShift on header)
type WorkerAssignmentWithRelations = Omit<
  SimpleWorkerAssignmentResponse,
  'workers'
> & {
  workers: WorkerAssignmentDetailWithWorker[];
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
  WorkerAssignmentDetail,
  WorkerAssignmentDetailId,
  CreateWorkerAssignment,
  CreateWorkerAssignmentWorker,
  UpdateWorkerAssignment,
  WorkerAssignmentSortBy,
  FindWorkerAssignmentQuery,
  SimpleWorkerAssignmentDetailResponse,
  WorkerAssignmentDetailWithWorker,
  SimpleWorkerAssignmentResponse,
  WorkerAssignmentWithRelations,
  WorkerAssignmentCreatedResponse,
  WorkerAssignmentSingleResponse,
  WorkerAssignmentUpdatedResponse,
  AllWorkerAssignmentsResponse,
};
