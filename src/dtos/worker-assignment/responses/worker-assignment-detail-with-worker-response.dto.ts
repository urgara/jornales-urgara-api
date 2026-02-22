import { ApiProperty } from '@nestjs/swagger';
import { WorkerAssignmentDetailResponseDto } from './worker-assignment-detail-response.dto';
import { WorkerResponseDto } from 'src/dtos/worker/responses';

export class WorkerAssignmentDetailWithWorkerResponseDto extends WorkerAssignmentDetailResponseDto {
  @ApiProperty({
    description: 'Datos del trabajador',
    type: WorkerResponseDto,
  })
  Worker: WorkerResponseDto;
}
