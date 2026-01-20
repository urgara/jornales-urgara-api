import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

import type { ErrorResponse } from '../../types/common';
import { ListErrors } from 'src/exceptions/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

// PrismaClientKnownRequestError es re-exportado desde @prisma/client-runtime-utils
// TypeScript no puede inferir completamente el tipo a través de la cadena de re-exports, pero el tipo en runtime es correcto

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error occurred';
    let errorName = ListErrors.DATABASE_ERROR;

    switch (exception.code) {
      case 'P2002':
        status = HttpStatus.CONFLICT;
        message = 'Unique constraint violation';
        errorName = ListErrors.DUPLICATE_ERROR;
        break;
      case 'P2025':
        status = HttpStatus.NOT_FOUND;
        message = 'Record not found';
        errorName = ListErrors.NOT_FOUND;
        break;
      case 'P2003':
        status = HttpStatus.BAD_REQUEST;
        message = 'Foreign key constraint violation';
        errorName = ListErrors.BAD_REQUEST;
        break;
      case 'P2016':
        status = HttpStatus.BAD_REQUEST;
        message = 'Query interpretation error';
        errorName = ListErrors.BAD_REQUEST;
        break;
      default:
        message = `Database error: ${exception.message}`;
        errorName = ListErrors.DATABASE_ERROR;
    }

    const errorResponse: ErrorResponse = {
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      code: status,
      message,
      name: errorName,
    };
    this.logger.error(
      errorResponse,
      exception instanceof Error ? exception.stack : exception,
    );
    response.status(status).json(errorResponse);
  }
}
