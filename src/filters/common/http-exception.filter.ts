import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { ErrorResponse } from '../../types/common';
import { ListErrors } from 'src/exceptions/common';

// Tipo para la respuesta de excepciones personalizadas
interface CustomExceptionResponse {
  msg: string;
  name: string;
  code: number;
}

// Tipo para respuestas estándar de NestJS
interface StandardExceptionResponse {
  message: string | string[];
  statusCode?: number;
  error?: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();

    // Helper para verificar si es una excepción personalizada
    const isCustomException = (
      response: unknown,
    ): response is CustomExceptionResponse => {
      return (
        typeof response === 'object' &&
        response !== null &&
        'msg' in response &&
        'name' in response &&
        'code' in response
      );
    };

    const isStandardException = (
      response: unknown,
    ): response is StandardExceptionResponse => {
      return (
        typeof response === 'object' &&
        response !== null &&
        'message' in response
      );
    };

    let message: string;
    let errorName: string;

    if (isCustomException(exceptionResponse)) {
      message = exceptionResponse.msg;
      errorName = exceptionResponse.name;
    } else if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      errorName = ListErrors.INTERNAL_SERVER_ERROR;
    } else if (isStandardException(exceptionResponse)) {
      message = Array.isArray(exceptionResponse.message)
        ? exceptionResponse.message.join(', ')
        : exceptionResponse.message;
      errorName = ListErrors.INTERNAL_SERVER_ERROR;
    } else {
      message = 'Internal server error';
      errorName = ListErrors.INTERNAL_SERVER_ERROR;
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
