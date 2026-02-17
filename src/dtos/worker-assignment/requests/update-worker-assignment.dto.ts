import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsEnum,
  Matches,
  ValidateNested,
  IsArray,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import type { UpdateWorkerAssignment } from 'src/types/worker-assignment';
import { CreateWorkerAssignmentWorkerDto } from './create-worker-assignment.dto';
import { CompanyRole } from 'generated/prisma-locality';

export class UpdateWorkerAssignmentDto implements UpdateWorkerAssignment {
  @ApiProperty({
    description: 'ID del turno de trabajo',
    example: '1f0b5b8c-1690-62e0-a9b1-6dec8a3787dd',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  workShiftId?: string;

  @ApiProperty({
    description: 'Fecha de la asignación (formato: YYYY-MM-DD)',
    example: '2024-01-15',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in format YYYY-MM-DD',
  })
  date?: string;

  @ApiProperty({
    description:
      'Lista de trabajadores (reemplaza todos los details existentes)',
    type: [CreateWorkerAssignmentWorkerDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateWorkerAssignmentWorkerDto)
  workers?: CreateWorkerAssignmentWorkerDto[];

  @ApiProperty({
    description: 'Jornal caído',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  jc?: boolean;

  @ApiProperty({
    description: 'ID de la empresa',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  companyId?: string;

  @ApiProperty({
    description: 'Rol de la empresa en la asignación',
    example: 'EXPORTER',
    enum: CompanyRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(CompanyRole)
  companyRole?: CompanyRole;

  @ApiProperty({
    description: 'ID de la localidad (UUID) - para identificar la DB',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  localityId?: string;

  @ApiProperty({
    description: 'ID de la terminal',
    example: '550e8400-e29b-41d4-a716-446655440004',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  terminalId?: string;

  @ApiProperty({
    description: 'ID del producto',
    example: '550e8400-e29b-41d4-a716-446655440005',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiProperty({
    description: 'ID del barco',
    example: '550e8400-e29b-41d4-a716-446655440006',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  shipId?: string;
}
