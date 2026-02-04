import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import type { Locality } from 'src/types/locality';

@Exclude()
export class LocalityResponseDto implements Locality {
  @ApiProperty({
    description: 'Locality ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

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
    description: 'Calculate JC flag',
    example: false,
  })
  @Expose()
  isCalculateJc: boolean;

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
