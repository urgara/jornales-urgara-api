import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { ListCompaniesResponse } from 'src/types/company';
import { CompanySelectItemDto } from './company-select-response.dto';

export class ListCompaniesResponseDto
  extends GenericDataResponseDto<CompanySelectItemDto[]>
  implements ListCompaniesResponse
{
  @ApiProperty({
    description: 'Lista de empresas para select',
    type: [CompanySelectItemDto],
  })
  declare data: CompanySelectItemDto[];
}
