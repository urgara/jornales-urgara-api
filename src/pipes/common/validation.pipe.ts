import { ValidationPipe, BadRequestException } from '@nestjs/common';
import type { ValidationError } from 'class-validator';
import { ListErrors } from '../../exceptions/common';

export default class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // Convierte strings de query params a números automáticamente
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const formattedErrors = this.formatErrors(validationErrors);

        // Usamos BadRequestException para que el ValidationExceptionFilter lo capture
        return new BadRequestException({
          message: 'Dto validation failed',
          errors: formattedErrors,
          errorType: ListErrors.VALIDATION_ERROR,
        });
      },
    });
  }

  private formatErrors(
    validationErrors: ValidationError[],
    parentKey = '',
  ): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    validationErrors.forEach((error) => {
      const property = parentKey
        ? `${parentKey}.${error.property}`
        : error.property;

      if (error.constraints) {
        errors[property] = Object.values(error.constraints);
      }

      if (error.children && error.children.length > 0) {
        const nestedErrors = this.formatErrors(error.children, property);
        Object.assign(errors, nestedErrors);
      }
    });

    return errors;
  }
}
