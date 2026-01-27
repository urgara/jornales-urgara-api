import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { CompanyUpdatedResponse } from 'src/types/company';
import { CompanyResponseDto } from './company-response.dto';

export class CompanyUpdatedResponseDto
  extends GenericDataResponseDto<CompanyResponseDto>
  implements CompanyUpdatedResponse
{
  @ApiProperty({
    description: 'Datos de la empresa actualizada',
    type: CompanyResponseDto,
  })
  declare data: CompanyResponseDto;
}
