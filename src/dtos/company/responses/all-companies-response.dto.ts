import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { AllCompaniesResponse } from 'src/types/company';
import { CompanyResponseDto } from './company-response.dto';

export class AllCompaniesResponseDto
  extends GenericDataResponseDto<CompanyResponseDto[]>
  implements AllCompaniesResponse
{
  @ApiProperty({
    description: 'Lista de empresas',
    type: [CompanyResponseDto],
  })
  declare data: CompanyResponseDto[];

  @ApiProperty({
    description: 'Información de paginación',
    example: {
      page: 1,
      limit: 10,
      total: 100,
      totalPages: 10,
    },
  })
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
