import { ApiProperty } from '@nestjs/swagger';
import { ListErrors } from 'src/exceptions/common';

export class ErrorResponseDto {
  @ApiProperty({
    example: false,
    description: 'Indica que la operación falló',
  })
  success: false;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Timestamp cuando ocurrió el error',
  })
  timestamp: string;

  @ApiProperty({
    example: '/api/auth/login',
    description: 'Ruta donde ocurrió el error',
  })
  path: string;

  @ApiProperty({
    example: 'POST',
    description: 'Método HTTP de la petición',
  })
  method: string;

  @ApiProperty({
    example: 400,
    description: 'Código de estado HTTP',
  })
  code: number;

  @ApiProperty({
    example: 'Bad Request',
    description: 'Mensaje de error principal',
  })
  message: string;

  @ApiProperty({
    example: 'BAD_REQUEST',
    description: 'Tipo de error basado en ListErrors enum',
    enum: ListErrors,
  })
  name: string;

  @ApiProperty({
    example: 'VALIDATION_ERROR',
    description: 'Código específico del error (deprecated, usar name)',
    required: false,
  })
  error?: string;
}

export class ValidationErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'Errores específicos de validación',
    oneOf: [
      {
        type: 'array',
        items: { type: 'string' },
        example: [
          'email must be an email',
          'password must be longer than 6 characters',
        ],
      },
      {
        type: 'object',
        additionalProperties: {
          type: 'array',
          items: { type: 'string' },
        },
        example: {
          email: ['must be an email'],
          password: ['must be longer than 6 characters'],
        },
      },
    ],
  })
  errors: string[] | Record<string, string[]>;
}

export class PrismaErrorResponseDto extends ErrorResponseDto {
  // Hereda todos los campos de ErrorResponseDto
  // El campo 'code' puede ser string para códigos de Prisma como 'P2002'
}
