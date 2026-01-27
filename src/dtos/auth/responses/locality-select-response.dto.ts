import { ApiProperty } from '@nestjs/swagger';
import { GenericDataResponseDto } from 'src/dtos/common';

export class LocalitySelectItemDto {
  @ApiProperty({
    description: 'ID de la localidad',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre de la localidad',
    example: 'Buenos Aires',
  })
  name: string;
}

export class LocalitySelectResponseDto extends GenericDataResponseDto<
  LocalitySelectItemDto[]
> {
  @ApiProperty({
    description: 'Lista de localidades para select',
    type: [LocalitySelectItemDto],
  })
  declare data: LocalitySelectItemDto[];
}
