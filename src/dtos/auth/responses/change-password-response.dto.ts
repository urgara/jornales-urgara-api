import { ApiProperty } from '@nestjs/swagger';
import { GenericResponseDto } from 'src/dtos/common';

export class ChangePasswordResponseDto extends GenericResponseDto {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Password changed successfully',
  })
  message: string;
}
