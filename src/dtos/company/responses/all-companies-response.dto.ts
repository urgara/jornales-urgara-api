import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { AllCompaniesResponse } from 'src/types/company';
import { CompanyWithLegalEntityResponseDto } from './company-with-legal-entity-response.dto';

export class AllCompaniesResponseDto
  extends GenericDataResponseDto<CompanyWithLegalEntityResponseDto[]>
  implements AllCompaniesResponse
{
  @ApiProperty({
    description: 'Lista de empresas con sus entidades legales',
    type: [CompanyWithLegalEntityResponseDto],
  })
  declare data: CompanyWithLegalEntityResponseDto[];

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
