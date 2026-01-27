import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { CompanySingleResponse } from 'src/types/company';
import { CompanyWithLegalEntityResponseDto } from './company-with-legal-entity-response.dto';

export class CompanySingleResponseDto
  extends GenericDataResponseDto<CompanyWithLegalEntityResponseDto>
  implements CompanySingleResponse
{
  @ApiProperty({
    description: 'Datos de la empresa con su entidad legal',
    type: CompanyWithLegalEntityResponseDto,
  })
  declare data: CompanyWithLegalEntityResponseDto;
}
