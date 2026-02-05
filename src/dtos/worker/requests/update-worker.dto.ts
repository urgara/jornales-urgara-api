import { PartialType, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateWorkerDto } from './create-worker.dto';
import type { UpdateWorker } from 'src/types/worker';

export class UpdateWorkerDto
  extends PartialType(CreateWorkerDto)
  implements UpdateWorker
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
