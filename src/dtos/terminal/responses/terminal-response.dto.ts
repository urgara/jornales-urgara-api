import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import type { Terminal } from 'src/types/terminal';

export class TerminalResponseDto implements Terminal {
  @ApiProperty({
    description: 'ID único de la terminal',
    example: '550e8400-e29b-41d4-a716-446655440004',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Nombre de la terminal',
    example: 'Terminal Central',
  })
  @Expose()
  name: string;
}
