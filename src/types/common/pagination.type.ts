interface PaginationRequest {
  page?: number;
  limit?: number;
}

interface PaginationResponse {
  page: number;
  total: number;
  totalPages: number;
}
interface PaginationDataResponse {
  pagination: PaginationResponse;
}
export type { PaginationRequest, PaginationResponse, PaginationDataResponse };
