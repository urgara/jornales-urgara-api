import type { PaginationResponse } from './pagination.type';

interface GenericResponse {
  success: boolean;
  message: string;
}
interface GenericDataResponse<T> extends GenericResponse {
  data: T;
}
interface GenericPaginationResponse<T> extends GenericDataResponse<T> {
  pagination: PaginationResponse;
}
export type { GenericDataResponse, GenericPaginationResponse, GenericResponse };
