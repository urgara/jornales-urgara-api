import type {
  WorkShift as PrismaWorkShift,
  BaseValueWorkShift as PrismaBaseValueWorkShift,
  ValueWorkShift as PrismaValueWorkShift,
  Prisma,
  Category,
  Port,
} from '../../../generated/prisma/client';
import { $Enums, DayOfWeek } from '../../../generated/prisma/client';
import type {
  DecimalNumber,
  PaginationRequest,
  Sorting,
  GenericResponse,
  GenericDataResponse,
  GenericPaginationResponse,
} from 'src/types/common';
import type { CategoryId } from '../category';

type WorkShift = PrismaWorkShift;
type WorkShifts = WorkShift[];
type WorkShiftId = WorkShift['id'];
type CreateWorkShift = Omit<
  WorkShift,
  'id' | 'createdAt' | 'deletedAt' | 'startTime' | 'endTime' | 'description'
> & {
  days: DayOfWeek[];
  startTime?: string; // HH:mm format - opcional para turnos especiales
  endTime?: string; // HH:mm format - opcional para turnos especiales
  description?: string; // Obligatorio cuando days está vacío
};
type UpdateWorkShift = Partial<CreateWorkShift>;
type CreateWorkShifts = Prisma.WorkShiftCreateManyInput[];
type BaseValueWorkShift = PrismaBaseValueWorkShift;
type CreateBaseValueWorkShifts = Prisma.BaseValueWorkShiftCreateManyInput[];
type ValueWorkShift = PrismaValueWorkShift;
type CreateValueWorkShifts = Prisma.ValueWorkShiftCreateManyInput[];

type ListWorkShifts = Pick<
  WorkShift,
  'id' | 'coefficient' | 'days'
> & {
  startTime?: Date | null;
  endTime?: Date | null;
  description?: string | null;
};

// ValueWorkShift with BaseValueWorkShift included (for select endpoint)
type ValueWorkShiftWithBaseValue = Omit<
  ValueWorkShift,
  'calculatedRemuneratedValue' | 'calculatedNotRemuneratedValue'
> & {
  calculatedRemuneratedValue: string;
  calculatedNotRemuneratedValue: string;
  BaseValueWorkShift: BaseValueWorkShiftResponse;
};

type ValueWorkShiftsWithBaseValue = ValueWorkShiftWithBaseValue[];

interface WorkShiftCategoryValue {
  categoryId: CategoryId;
  remunerated: number;
  notRemunerated: number;
}

interface CreateValuesWorkShiftsData {
  initialDate: BaseValueWorkShift['startDate'];
  portId: BaseValueWorkShift['portId'];
  jc: boolean;
  values: {
    STANDART: WorkShiftCategoryValue[];
  };
  list: Array<{
    id: string;
    description?: string;
    coefficient: DecimalNumber;
    categoryIds?: number[];
  }>;
}

type WorkShiftType = $Enums.WorkShiftType;
const WorkShiftTypeEnum = $Enums.WorkShiftType;

type WorkShiftSortBy = keyof WorkShift;
type BaseValueWorkShiftSortBy = keyof BaseValueWorkShift;

interface FindWorkShiftQuery
  extends Sorting<WorkShiftSortBy>,
    PaginationRequest,
    Partial<Pick<WorkShift, 'description' | 'createdAt' | 'deletedAt'>> {}

interface FindBaseValueWorkShiftQuery
  extends Sorting<BaseValueWorkShiftSortBy>,
    PaginationRequest,
    Partial<
      Pick<
        BaseValueWorkShift,
        'portId' | 'categoryId' | 'startDate' | 'endDate'
      >
    > {}

// Response types with transformed Decimal to string
type BaseValueWorkShiftResponse = Omit<
  BaseValueWorkShift,
  'remuneratedValue' | 'notRemuneratedValue'
> & {
  remuneratedValue: string;
  notRemuneratedValue: string;
  Category: Category;
};

// Response type combining WorkShift and ValueWorkShift data
type WorkShiftResponse = Omit<
  WorkShift,
  'coefficient' | 'startTime' | 'endTime'
> & {
  coefficient: string;
  startTime?: string | null; // HH:mm format - opcional/null para turnos especiales
  endTime?: string | null; // HH:mm format - opcional/null para turnos especiales
  calculatedRemuneratedValue: string;
  calculatedNotRemuneratedValue: string;
  type: WorkShiftType;
  baseValueWorkShiftId: number;
};

// Simple response type for basic WorkShift data
type SimpleWorkShiftResponse = Omit<
  WorkShift,
  'coefficient' | 'startTime' | 'endTime'
> & {
  coefficient: string;
  startTime?: string | null; // HH:mm format - opcional/null para turnos especiales
  endTime?: string | null; // HH:mm format - opcional/null para turnos especiales
};

// ValueWorkShift with WorkShift included
type ValueWorkShiftWithWorkShift = Omit<
  ValueWorkShift,
  'calculatedRemuneratedValue' | 'calculatedNotRemuneratedValue'
> & {
  calculatedRemuneratedValue: string;
  calculatedNotRemuneratedValue: string;
  WorkShift: SimpleWorkShiftResponse;
};

// BaseValueWorkShift with ValueWorkShift array included
type BaseValueWorkShiftWithValueShifts = BaseValueWorkShiftResponse & {
  ValueWorkShift: ValueWorkShiftWithWorkShift[];
};

// WorkShiftConfig types
type WorkShiftConfig = {
  id: number;
  config: Prisma.JsonValue;
};

type WorkShiftConfigId = WorkShiftConfig['id'];

type CreateOrUpdateWorkShiftConfig = {
  id: number;
  config: WorkShiftConfigData;
};

type WorkShiftConfigData = {
  jc: boolean;
  types: {
    STANDART: number[];
  };
  portId: number;
  list: Array<{
    id: string;
    description?: string;
    coefficient: string;
    categoryIds?: number[];
  }>;
};

// Response types for DTOs
type WorkShiftsCreatedResponse = GenericResponse;
type WorkShiftCreatedResponse = GenericDataResponse<SimpleWorkShiftResponse>;
type WorkShiftSingleResponse = GenericDataResponse<SimpleWorkShiftResponse>;
type WorkShiftUpdatedResponse = GenericDataResponse<SimpleWorkShiftResponse>;
type WorkShiftDeletedResponse = GenericResponse;
type AllWorkShiftsResponse = GenericPaginationResponse<
  SimpleWorkShiftResponse[]
>;
type AllBaseValueWorkShiftsResponse = GenericPaginationResponse<
  BaseValueWorkShiftWithValueShifts[]
>;
type ListBaseValueWorkShiftsResponse =
  GenericDataResponse<ValueWorkShiftsWithBaseValue>;
type WorkShiftConfigResponse = GenericDataResponse<WorkShiftConfig>;

export type {
  WorkShift,
  WorkShiftId,
  CreateWorkShift,
  UpdateWorkShift,
  BaseValueWorkShift,
  ValueWorkShift,
  ListWorkShifts,
  ValueWorkShiftWithBaseValue,
  ValueWorkShiftsWithBaseValue,
  WorkShiftCategoryValue,
  CreateValuesWorkShiftsData,
  WorkShiftType,
  WorkShiftSortBy,
  BaseValueWorkShiftSortBy,
  FindWorkShiftQuery,
  FindBaseValueWorkShiftQuery,
  WorkShifts,
  CreateBaseValueWorkShifts,
  CreateValueWorkShifts,
  BaseValueWorkShiftResponse,
  WorkShiftResponse,
  SimpleWorkShiftResponse,
  ValueWorkShiftWithWorkShift,
  BaseValueWorkShiftWithValueShifts,
  CreateWorkShifts,
  WorkShiftConfig,
  WorkShiftConfigId,
  CreateOrUpdateWorkShiftConfig,
  WorkShiftConfigData,
  WorkShiftsCreatedResponse,
  WorkShiftCreatedResponse,
  WorkShiftSingleResponse,
  WorkShiftUpdatedResponse,
  WorkShiftDeletedResponse,
  AllWorkShiftsResponse,
  AllBaseValueWorkShiftsResponse,
  ListBaseValueWorkShiftsResponse,
  WorkShiftConfigResponse,
};
export { WorkShiftTypeEnum, DayOfWeek };
