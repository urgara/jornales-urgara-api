import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { CompanySingleResponse } from 'src/types/company';
import { CompanyResponseDto } from './company-response.dto';

export class CompanySingleResponseDto
  extends GenericDataResponseDto<CompanyResponseDto>
  implements CompanySingleResponse
{
  @ApiProperty({
    description: 'Datos de la empresa',
    type: CompanyResponseDto,
  })
  declare data: CompanyResponseDto;
}
