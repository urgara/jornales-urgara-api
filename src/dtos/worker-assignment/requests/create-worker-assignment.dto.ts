import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import type { CreateWorkerAssignment } from 'src/types/worker-assignment';
import type { LocalityOperationContext } from 'src/types/locality';
import { DecimalService } from 'src/services/common';
import type { DecimalNumber } from 'src/types/common';
import { IsDecimalNumber } from 'src/decorators/common';

export class CreateWorkerAssignmentDto implements CreateWorkerAssignment, LocalityOperationContext {
  @ApiProperty({
    description: 'ID del trabajador',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  workerId: string;

  @ApiProperty({
    description: 'ID del turno de trabajo',
    example: '1f0b5b8c-1690-62e0-a9b1-6dec8a3787dd',
  })
  @IsNotEmpty()
  @IsUUID()
  workShiftId: string;

  @ApiProperty({
    description: 'Fecha de la asignación (formato: YYYY-MM-DD)',
    example: '2024-01-15',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in format YYYY-MM-DD',
  })
  date: string;

  @ApiProperty({
    description: 'Porcentaje adicional opcional (ej: 15.00 = 15%)',
    example: '15.00',
    type: 'string',
    required: false,
  })
  @Transform(({ value }) => (value ? DecimalService.create(value) : undefined))
  @IsOptional()
  @IsDecimalNumber()
  additionalPercent?: DecimalNumber;

  @ApiProperty({
    description: 'ID de la empresa',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsNotEmpty()
  @IsUUID()
  companyId: string;

  @ApiProperty({
    description: 'ID de la localidad',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @IsNotEmpty()
  @IsUUID()
  localityId: string;

  @ApiProperty({
    description: 'ID de la agencia',
    example: '550e8400-e29b-41d4-a716-446655440003',
  })
  @IsNotEmpty()
  @IsUUID()
  agencyId: string;

  @ApiProperty({
    description: 'ID de la terminal',
    example: '550e8400-e29b-41d4-a716-446655440004',
  })
  @IsNotEmpty()
  @IsUUID()
  terminalId: string;

  @ApiProperty({
    description: 'ID del producto',
    example: '550e8400-e29b-41d4-a716-446655440005',
  })
  @IsNotEmpty()
  @IsUUID()
  productId: string;
}
