import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common';
import type {
  WorkShiftId,
  UpdateWorkShift,
} from 'src/types/work-shift';
import { NotFoundException } from 'src/exceptions/common';

@Injectable()
export class UpdateWorkShiftService {
  constructor(private readonly databaseService: DatabaseService) {}

  async update(id: WorkShiftId, updateData: UpdateWorkShift) {
    // Verificar si el work shift existe
    const existingWorkShift = await this.databaseService.workShift.findUnique({
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
      description?: UpdateWorkShift['description'];
      coefficient?: UpdateWorkShift['coefficient'];
    } = {};

    if (updateData.days !== undefined) {
      dataToUpdate.days = updateData.days;
    }

    if (updateData.startTime) {
      dataToUpdate.startTime = new Date(`1970-01-01T${updateData.startTime}:00Z`);
    }

    if (updateData.endTime) {
      dataToUpdate.endTime = new Date(`1970-01-01T${updateData.endTime}:00Z`);
    }

    if (updateData.description !== undefined) {
      dataToUpdate.description = updateData.description;
    }

    if (updateData.coefficient !== undefined) {
      dataToUpdate.coefficient = updateData.coefficient;
    }

    // Actualizar el work shift
    const updatedWorkShift = await this.databaseService.workShift.update({
      where: { id },
      data: dataToUpdate,
    });

    return updatedWorkShift;
  }
}
