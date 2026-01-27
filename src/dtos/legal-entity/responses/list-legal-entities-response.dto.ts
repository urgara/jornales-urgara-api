import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';
import type { ListLegalEntitiesResponse } from 'src/types/legal-entity';
import { LegalEntitySelectItemDto } from './legal-entity-select-response.dto';

export class ListLegalEntitiesResponseDto
  extends GenericDataResponseDto<LegalEntitySelectItemDto[]>
  implements ListLegalEntitiesResponse
{
  @ApiProperty({
    description: 'Lista de entidades legales para select',
    type: [LegalEntitySelectItemDto],
  })
  declare data: LegalEntitySelectItemDto[];
}
