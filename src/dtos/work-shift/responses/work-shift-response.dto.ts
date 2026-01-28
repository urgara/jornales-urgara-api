import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import type { DecimalNumber } from 'src/types/common';
import { type SimpleWorkShiftResponse, DayOfWeek } from 'src/types/work-shift';

export class WorkShiftResponseDto implements SimpleWorkShiftResponse {
  @ApiProperty({
    description: 'ID del turno de trabajo',
    example: '1f0b5b8c-1690-62e0-a9b1-6dec8a3787dd',
  })
  id: string;

  @ApiProperty({
    description: 'Días aplicables al turno',
    example: ['M', 'T', 'W', 'Th', 'F', 'S'],
    enum: DayOfWeek,
    isArray: true,
  })
  days: DayOfWeek[];

  @ApiProperty({
    description: 'Hora de inicio del turno (formato HH:mm)',
    example: '08:00',
    nullable: true,
  })
  @Transform(({ value }: { value: Date | null }) => {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  })
  startTime?: string | null;

  @ApiProperty({
    description: 'Hora de fin del turno (formato HH:mm)',
    example: '14:00',
    nullable: true,
  })
  @Transform(({ value }: { value: Date | null }) => {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  })
  endTime?: string | null;

  @ApiProperty({
    description: 'Duración del turno en minutos totales (ej: 360 = 6 horas, 510 = 8.5 horas)',
    example: 360,
  })
  durationMinutes: number;

  @ApiProperty({
    description: 'Descripción manual del turno',
    example: 'Encargado de carga',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Coeficiente del turno',
    example: '1.50',
    type: 'string',
  })
  @Transform(({ value }: { value: DecimalNumber }) => value?.toString())
  coefficient: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T08:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de eliminación (soft delete)',
    example: null,
    nullable: true,
  })
  deletedAt: Date | null;
}
