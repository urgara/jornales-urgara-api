import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { AdminRole, type AdminTypeRole } from 'src/types/auth';
import type { Admin } from 'src/types/auth';
import { LocalityResponseDto } from './locality-response.dto';

export class AdminResponseDto implements Admin {
  @ApiProperty({
    description: 'Admin ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Admin name',
    example: 'Juan',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Admin surname',
    example: 'Pérez',
  })
  @Expose()
  surname: string;

  @ApiProperty({
    description: 'Admin DNI',
    example: '12345678',
  })
  @Expose()
  dni: string;

  @ApiProperty({
    description: 'Locality ID - null for global administrators',
    example: null,
    nullable: true,
  })
  @Expose()
  localityId: string | null;

  @ApiProperty({
    description: 'Locality information - included when available',
    type: LocalityResponseDto,
    nullable: true,
  })
  @Expose()
  Locality?: LocalityResponseDto | null;

  @ApiProperty({
    description: 'Admin role',
    enum: AdminRole,
    example: AdminRole.ADMIN,
  })
  @Expose()
  role: AdminTypeRole;

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

  @ApiHideProperty()
  @Exclude()
  password: string;
}
