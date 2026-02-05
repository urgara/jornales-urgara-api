import { Injectable } from '@nestjs/common';
import {
  DatabaseLocalityService,
  UuidService,
  LocalityResolverService,
} from '../common';
import type { CreateWorkShift } from 'src/types/work-shift';
import type { LocalityOperationContext } from 'src/types/locality';
import type { Admin } from 'src/types/auth';
import { BadRequestException } from 'src/exceptions/common';

@Injectable()
export class CreateWorkShiftService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly uuidService: UuidService,
    private readonly localityResolver: LocalityResolverService,
  ) {}

  async create(
    admin: Pick<Admin, 'role' | 'localityId'>,
    data: CreateWorkShift & LocalityOperationContext,
  ) {
    // localityId viene del body (data.localityId)
    const localityId = this.localityResolver.resolve(admin, data.localityId);
    const { days, startTime, endTime, description, coefficient } = data;

    const workShiftId = this.uuidService.V6();

    /**
     * Convertir strings de tiempo (HH:mm) a objetos Date para PostgreSQL TIME
     * Usa 1970-01-01 como fecha dummy (epoch Unix) ya que solo se almacena la porción de tiempo
     * La 'Z' indica UTC para evitar conversiones de timezone
     * PostgreSQL @db.Time extrae únicamente horas, minutos y segundos del objeto Date
     */
    const startTimeDate = new Date(`1970-01-01T${startTime}:00Z`);
    const endTimeDate = new Date(`1970-01-01T${endTime}:00Z`);

    /**
     * Calcular duración en minutos desde startTime y endTime
     * Fórmula: (endTime - startTime) en milisegundos / 1000 (ms a segundos) / 60 (segundos a minutos)
     * Ejemplo: startTime=08:00, endTime=16:30 → 8.5 horas = 510 minutos
     */
    const durationMinutes =
      (endTimeDate.getTime() - startTimeDate.getTime()) / 1000 / 60;

    // Validar que la duración no sea negativa (endTime debe ser mayor a startTime)
    if (durationMinutes <= 0) {
      throw new BadRequestException(
        'End time must be greater than start time. Night shifts crossing midnight are not supported.',
      );
    }

    const db = this.databaseService.getTenantClient(localityId);
    const workShift = await db.workShift.create({
      data: {
        id: workShiftId,
        days,
        startTime: startTimeDate,
        endTime: endTimeDate,
        durationMinutes: Math.round(durationMinutes), // Redondear al minuto más cercano
        description,
        coefficient,
      },
    });

    return workShift;
  }
}
