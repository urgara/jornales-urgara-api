import { ApiProperty } from '@nestjs/swagger';
import type { GenericDataResponse } from 'src/types/common';

export class GenericDataResponseDto<T> implements GenericDataResponse<T> {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensaje descriptivo del resultado',
    example: 'Operation completed successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Datos de la respuesta',
    required: false,
  })
  data: T;

  constructor(success: boolean, message: string, data: T) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}
