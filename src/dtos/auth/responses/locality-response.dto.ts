import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import type { Locality } from 'src/types/locality';

export class LocalityResponseDto implements Locality {
  @ApiProperty({
    description: 'Locality ID',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Locality name',
    example: 'Buenos Aires',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Province name',
    example: 'Buenos Aires',
  })
  @Expose()
  province: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-15T10:30:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Deletion date',
    example: null,
    nullable: true,
  })
  @Expose()
  deletedAt: Date | null;
}
