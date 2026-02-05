import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateWorkShiftDto } from './create-work-shift.dto';
import type { UpdateWorkShift } from 'src/types/work-shift';

export class UpdateWorkShiftDto
  extends PartialType(CreateWorkShiftDto)
  implements UpdateWorkShift
{
  @ApiProperty({
    description: 'ID de la localidad (UUID) - para identificar la DB',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  localityId?: string;
}
