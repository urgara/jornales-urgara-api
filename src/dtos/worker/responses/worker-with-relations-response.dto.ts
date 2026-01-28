import { ApiProperty } from '@nestjs/swagger';
import { WorkerResponseDto } from './worker-response.dto';
import { CompanyResponseDto } from 'src/dtos/company/responses';
import { LocalityResponseDto } from 'src/dtos/auth/responses';

export class WorkerWithRelationsResponseDto extends WorkerResponseDto {
  @ApiProperty({
    description: 'Empresa asociada',
    type: CompanyResponseDto,
    nullable: true,
  })
  Company: CompanyResponseDto | null;

  @ApiProperty({
    description: 'Localidad asociada',
    type: LocalityResponseDto,
  })
  Locality: LocalityResponseDto;
}
