import { ApiProperty } from '@nestjs/swagger';

export class CompanySelectItemDto {
  @ApiProperty({
    description: 'ID de la empresa',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre de la empresa',
    example: 'Acme Corporation',
  })
  name: string;
}
