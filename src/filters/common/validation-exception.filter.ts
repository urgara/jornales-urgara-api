import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import type {
  ValidationErrorResponse,
  ErrorResponse,
} from '../../types/common';
import { ListErrors } from 'src/exceptions/common';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as
      | string
      | {
          message?: string | string[];
          errors?: string[] | Record<string, string[]>;
          msg?: string;
          name?: string;
        };

    // Si es una excepción personalizada (tiene msg, name, code), no la manejamos aquí
    // Esas las maneja el HttpExceptionFilter
    if (
      typeof exceptionResponse === 'object' &&
      'msg' in exceptionResponse &&
      'name' in exceptionResponse
    ) {
      throw exception; // Re-lanza para que la maneje HttpExceptionFilter
    }

    // Handle validation errors specifically
    if (
      typeof exceptionResponse === 'object' &&
      'errors' in exceptionResponse &&
      exceptionResponse.errors
    ) {
      // Errores de validación del CustomValidationPipe
      const errorResponse: ValidationErrorResponse = {
        success: false,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        code: status,
        message:
          (typeof exceptionResponse.message === 'string'
            ? exceptionResponse.message
            : undefined) || 'Validation failed',
        name: ListErrors.VALIDATION_ERROR,
        errors: exceptionResponse.errors,
      };
      this.logger.error(
        errorResponse,
        exception instanceof Error ? exception.stack : exception,
      );
      response.status(status).json(errorResponse);
    } else if (
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse &&
      Array.isArray(exceptionResponse.message)
    ) {
      // Errores de validación estándar de NestJS
      const errorResponse: ValidationErrorResponse = {
        success: false,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        code: status,
        message: 'Validation failed',
        name: ListErrors.VALIDATION_ERROR,
        errors: exceptionResponse.message,
      };
      this.logger.error(
        errorResponse,
        exception instanceof Error ? exception.stack : exception,
      );
      response.status(status).json(errorResponse);
    } else {
      // Otros errores BadRequest
      const errorResponse: ErrorResponse = {
        success: false,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        code: status,
        message:
          (typeof exceptionResponse === 'object' &&
          'message' in exceptionResponse &&
          typeof exceptionResponse.message === 'string'
            ? exceptionResponse.message
            : typeof exceptionResponse === 'string'
              ? exceptionResponse
              : undefined) || 'Bad Request',
        name: ListErrors.BAD_REQUEST,
      };
      this.logger.error(
        errorResponse,
        exception instanceof Error ? exception.stack : exception,
      );
      response.status(status).json(errorResponse);
    }
  }
}
