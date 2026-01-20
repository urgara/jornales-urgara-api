export interface ErrorResponse {
  success: false;
  timestamp: string;
  path: string;
  method: string;
  code: number;
  message: string;
  name: string; // ListErrors name
  error?: string;
  errors?: string[] | Record<string, string[]>;
}

export interface ValidationErrorResponse extends ErrorResponse {
  errors: string[] | Record<string, string[]>;
}
