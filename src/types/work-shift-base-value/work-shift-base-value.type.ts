import type {
  WorkShiftBaseValue as PrismaWorkShiftBaseValue,
  WorkShiftCalculatedValue as PrismaWorkShiftCalculatedValue,
} from '../../../generated/prisma-locality';
import type {
  PaginationRequest,
  Sorting,
  DecimalNumber,
} from 'src/types/common';

type WorkShiftBaseValue = PrismaWorkShiftBaseValue;
type WorkShiftBaseValueId = WorkShiftBaseValue['id'];
type WorkShiftCalculatedValue = PrismaWorkShiftCalculatedValue;

type CreateWorkShiftBaseValue = Omit<
  WorkShiftBaseValue,
  'id' | 'startDate' | 'endDate'
> & {
  startDate: string;
  endDate: string;
  coefficients: DecimalNumber[];
};

type WorkShiftBaseValueWithCalculated = WorkShiftBaseValue & {
  workShiftCalculatedValues: WorkShiftCalculatedValue[];
};

type WorkShiftBaseValueSortBy = 'id' | 'startDate' | 'endDate';

interface FindWorkShiftBaseValueQuery
  extends Sorting<WorkShiftBaseValueSortBy>,
    PaginationRequest {
  localityId?: string;
}

// Response types (Decimal → string)
interface SimpleWorkShiftCalculatedValueResponse {
  workShiftBaseValueId: string;
  coefficient: string;
  remunerated: string;
  notRemunerated: string;
}

interface SimpleWorkShiftBaseValueResponse {
  id: string;
  remunerated: string;
  notRemunerated: string;
  startDate: Date;
  endDate: Date;
  workShiftCalculatedValues: SimpleWorkShiftCalculatedValueResponse[];
}

interface WorkShiftBaseValueCreatedResponse {
  success: boolean;
  message: string;
  data: SimpleWorkShiftBaseValueResponse;
}

interface WorkShiftBaseValueSingleResponse {
  success: boolean;
  message: string;
  data: SimpleWorkShiftBaseValueResponse;
}

interface AllWorkShiftBaseValuesResponse {
  success: boolean;
  message: string;
  data: SimpleWorkShiftBaseValueResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type {
  WorkShiftBaseValue,
  WorkShiftBaseValueId,
  WorkShiftCalculatedValue,
  CreateWorkShiftBaseValue,
  WorkShiftBaseValueWithCalculated,
  WorkShiftBaseValueSortBy,
  FindWorkShiftBaseValueQuery,
  SimpleWorkShiftCalculatedValueResponse,
  SimpleWorkShiftBaseValueResponse,
  WorkShiftBaseValueCreatedResponse,
  WorkShiftBaseValueSingleResponse,
  AllWorkShiftBaseValuesResponse,
};
