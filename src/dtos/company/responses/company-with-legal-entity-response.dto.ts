import { ApiProperty } from '@nestjs/swagger';
import { CompanyResponseDto } from './company-response.dto';
import { LegalEntityResponseDto } from 'src/dtos/legal-entity/responses';

export class CompanyWithLegalEntityResponseDto extends CompanyResponseDto {
  @ApiProperty({
    description: 'Entidad legal asociada',
    type: LegalEntityResponseDto,
  })
  LegalEntity: LegalEntityResponseDto;
}
