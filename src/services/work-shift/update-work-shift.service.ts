import { Injectable } from '@nestjs/common';
import { DatabaseLocalityService, LocalityResolverService } from '../common';
import type { WorkShiftId, UpdateWorkShift } from 'src/types/work-shift';
import type { LocalityOperationContext } from 'src/types/locality';
import type { Admin } from 'src/types/auth';
import { NotFoundException, BadRequestException } from 'src/exceptions/common';

@Injectable()
export class UpdateWorkShiftService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly localityResolver: LocalityResolverService,
  ) {}

  async update(
    id: WorkShiftId,
    admin: Pick<Admin, 'role' | 'localityId'>,
    data: UpdateWorkShift & Partial<LocalityOperationContext>,
  ) {
    // localityId viene del body (data.localityId) - opcional para PATCH
    const localityId = this.localityResolver.resolve(admin, data.localityId);
    const db = this.databaseService.getTenantClient(localityId);
    // Verificar si el work shift existe
    const existingWorkShift = await db.workShift.findUnique({
      where: { id, deletedAt: null },
    });

    if (!existingWorkShift) {
      throw new NotFoundException('Work shift not found');
    }

    /**
     * Convertir strings de tiempo (HH:mm) a objetos Date para PostgreSQL TIME
     * Usa 1970-01-01 como fecha dummy (epoch Unix) ya que solo se almacena la porción de tiempo
     * La 'Z' indica UTC para evitar conversiones de timezone
     * PostgreSQL @db.Time extrae únicamente horas, minutos y segundos del objeto Date
     */
    const dataToUpdate: {
      days?: UpdateWorkShift['days'];
      startTime?: Date;
      endTime?: Date;
      durationMinutes?: number;
      description?: UpdateWorkShift['description'];
      coefficient?: UpdateWorkShift['coefficient'];
    } = {};

    if (data.days !== undefined) {
      dataToUpdate.days = data.days;
    }

    if (data.startTime) {
      dataToUpdate.startTime = new Date(`1970-01-01T${data.startTime}:00Z`);
    }

    if (data.endTime) {
      dataToUpdate.endTime = new Date(`1970-01-01T${data.endTime}:00Z`);
    }

    /**
     * Recalcular durationMinutes si se actualizó startTime o endTime
     * Usar valores actualizados o existentes para el cálculo
     */
    if (data.startTime || data.endTime) {
      const finalStartTime =
        dataToUpdate.startTime || existingWorkShift.startTime;
      const finalEndTime = dataToUpdate.endTime || existingWorkShift.endTime;

      // Convertir Date a milisegundos y calcular diferencia en minutos
      // Si cruza medianoche (ej: 19:00 → 01:00), sumar 1440 min (24h)
      let durationMinutes =
        (finalEndTime.getTime() - finalStartTime.getTime()) / 1000 / 60;

      if (durationMinutes < 0) {
        durationMinutes += 1440;
      }

      if (durationMinutes === 0) {
        throw new BadRequestException(
          'Start time and end time cannot be the same.',
        );
      }

      dataToUpdate.durationMinutes = Math.round(durationMinutes);
    }

    if (data.description !== undefined) {
      dataToUpdate.description = data.description;
    }

    if (data.coefficient !== undefined) {
      dataToUpdate.coefficient = data.coefficient;
    }

    // Actualizar el work shift
    const updatedWorkShift = await db.workShift.update({
      where: { id },
      data: dataToUpdate,
    });

    return updatedWorkShift;
  }
}
