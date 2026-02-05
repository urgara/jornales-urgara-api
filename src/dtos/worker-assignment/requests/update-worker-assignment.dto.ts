import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateWorkerAssignmentDto } from './create-worker-assignment.dto';
import type { UpdateWorkerAssignment } from 'src/types/worker-assignment';

export class UpdateWorkerAssignmentDto
  extends PartialType(CreateWorkerAssignmentDto)
  implements UpdateWorkerAssignment
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
