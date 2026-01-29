import { ApiProperty } from '@nestjs/swagger';
import { WorkerAssignmentResponseDto } from './worker-assignment-response.dto';
import { WorkerResponseDto } from 'src/dtos/worker/responses';
import { WorkShiftResponseDto } from 'src/dtos/work-shift/responses';

export class WorkerAssignmentWithRelationsDto extends WorkerAssignmentResponseDto {
  @ApiProperty({
    description: 'Datos del trabajador',
    type: WorkerResponseDto,
  })
  Worker: WorkerResponseDto;

  @ApiProperty({
    description: 'Datos del turno',
    type: WorkShiftResponseDto,
  })
  WorkShift: WorkShiftResponseDto;
}
