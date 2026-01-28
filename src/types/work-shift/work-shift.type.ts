import type { WorkShift as PrismaWorkShift } from '../../../generated/prisma/client';
import { DayOfWeek } from '../../../generated/prisma/client';
import type {
  PaginationRequest,
  Sorting,
  GenericResponse,
  GenericDataResponse,
  GenericPaginationResponse,
} from 'src/types/common';

type WorkShift = PrismaWorkShift;
type WorkShiftId = WorkShift['id'];

type CreateWorkShift = Omit<
  WorkShift,
  | 'id'
  | 'createdAt'
  | 'deletedAt'
  | 'startTime'
  | 'endTime'
  | 'description'
  | 'durationMinutes'
> & {
  days: DayOfWeek[];
  startTime?: string; // HH:mm format - opcional para turnos especiales
  endTime?: string; // HH:mm format - opcional para turnos especiales
  description?: string; // Obligatorio cuando days está vacío
  // durationMinutes se calcula automáticamente, no se incluye en el create
};

type UpdateWorkShift = Partial<CreateWorkShift>;

type WorkShiftSortBy = 'id' | 'description' | 'createdAt';

interface FindWorkShiftQuery
  extends Sorting<WorkShiftSortBy>,
    PaginationRequest {
  description?: string;
}

// Response type for transformed WorkShift (Decimal → string, Date → string)
type SimpleWorkShiftResponse = Omit<
  WorkShift,
  'coefficient' | 'startTime' | 'endTime'
> & {
  coefficient: string;
  durationMinutes: number; // Duración en minutos (ej: 510 = 8.5 horas)
  startTime?: string | null; // HH:mm format
  endTime?: string | null; // HH:mm format
};

// Response interface types
interface WorkShiftCreatedResponse {
  success: boolean;
  message: string;
  data: SimpleWorkShiftResponse;
}

interface WorkShiftSingleResponse {
  success: boolean;
  message: string;
  data: SimpleWorkShiftResponse;
}

interface WorkShiftUpdatedResponse {
  success: boolean;
  message: string;
  data: SimpleWorkShiftResponse;
}

interface WorkShiftDeletedResponse {
  success: boolean;
  message: string;
}

interface AllWorkShiftsResponse {
  success: boolean;
  message: string;
  data: SimpleWorkShiftResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ListWorkShiftsResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: string;
    description: string;
  }>;
}

export type {
  WorkShift,
  WorkShiftId,
  CreateWorkShift,
  UpdateWorkShift,
  WorkShiftSortBy,
  FindWorkShiftQuery,
  SimpleWorkShiftResponse,
  WorkShiftCreatedResponse,
  WorkShiftSingleResponse,
  WorkShiftUpdatedResponse,
  WorkShiftDeletedResponse,
  AllWorkShiftsResponse,
  ListWorkShiftsResponse,
};

export { DayOfWeek };
