import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsIn } from 'class-validator';
import { AdminRole, type AdminTypeRole } from 'src/types/auth';
import { PaginationRequestDto } from 'src/dtos/common';
import type { AdminSortBy, FindAdminsQuery } from 'src/types/auth';

const adminSortBy: AdminSortBy[] = [
  'name',
  'surname',
  'dni',
  'role',
  'createdAt',
  'deletedAt',
];

export class AdminsQueryDto
  extends PaginationRequestDto
  implements FindAdminsQuery
{
  @ApiPropertyOptional({
    description: 'Field to sort by',
    example: adminSortBy[0],
    enum: adminSortBy,
  })
  @IsOptional()
  @IsString()
  @IsIn(adminSortBy)
  sortBy?: AdminSortBy;

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'asc',
    enum: ['asc', 'desc'],
    default: 'asc',
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';

  @ApiPropertyOptional({
    description: 'Filter by name (partial match)',
    example: 'Juan',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filter by surname (partial match)',
    example: 'Pérez',
  })
  @IsOptional()
  @IsString()
  surname?: string;

  @ApiPropertyOptional({
    description: 'Filter by DNI (partial match)',
    example: '12345',
  })
  @IsOptional()
  @IsString()
  dni?: string;

  @ApiPropertyOptional({
    description: 'Filter by role',
    enum: AdminRole,
    example: AdminRole.ADMIN,
  })
  @IsOptional()
  @IsEnum(AdminRole)
  role?: AdminTypeRole;
}
