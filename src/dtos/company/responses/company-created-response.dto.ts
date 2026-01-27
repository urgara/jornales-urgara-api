import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { CompanyCreatedResponse } from 'src/types/company';
import { CompanyResponseDto } from './company-response.dto';

export class CompanyCreatedResponseDto
  extends GenericDataResponseDto<CompanyResponseDto>
  implements CompanyCreatedResponse
{
  @ApiProperty({
    description: 'Datos de la empresa creada',
    type: CompanyResponseDto,
  })
  declare data: CompanyResponseDto;
}
