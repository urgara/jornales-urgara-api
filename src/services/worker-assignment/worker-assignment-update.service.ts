import { Injectable } from '@nestjs/common';
import {
  DatabaseLocalityService,
  DecimalService,
  LocalityResolverService,
} from '../common';
import type {
  WorkerAssignmentId,
  UpdateWorkerAssignment,
} from 'src/types/worker-assignment';
import type { LocalityOperationContext } from 'src/types/locality';
import type { Admin } from 'src/types/auth';
import { NotFoundException } from 'src/exceptions/common';

@Injectable()
export class WorkerAssignmentUpdateService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly decimalService: DecimalService,
    private readonly localityResolver: LocalityResolverService,
  ) {}

  async update(
    id: WorkerAssignmentId,
    admin: Pick<Admin, 'role' | 'localityId'>,
    data: UpdateWorkerAssignment & Partial<LocalityOperationContext>,
  ) {
    // localityId viene del body (data.localityId) - opcional para PATCH
    const localityId = this.localityResolver.resolve(admin, data.localityId);
    const db = this.databaseService.getTenantClient(localityId);
    // Verificar que la asignación existe
    const existingAssignment = await db.workerAssignment.findUnique({
      where: { id },
    });

    if (!existingAssignment) {
      throw new NotFoundException('Worker assignment not found');
    }

    const dataToUpdate: any = {};

    // Si se actualiza workerId, verificar que existe
    if (data.workerId !== undefined) {
      const worker = await db.worker.findUnique({
        where: { id: data.workerId, deletedAt: null },
      });

      if (!worker) {
        throw new NotFoundException('Worker not found');
      }

      dataToUpdate.workerId = data.workerId;
    }

    // Si se actualiza workShiftId, verificar que existe
    if (data.workShiftId !== undefined) {
      const workShift = await db.workShift.findUnique({
        where: { id: data.workShiftId, deletedAt: null },
      });

      if (!workShift) {
        throw new NotFoundException('Work shift not found');
      }

      dataToUpdate.workShiftId = data.workShiftId;
    }

    if (data.date !== undefined) {
      dataToUpdate.date = new Date(data.date);
    }

    if (data.category !== undefined) {
      dataToUpdate.category = data.category;
    }

    if (data.additionalPercent !== undefined) {
      dataToUpdate.additionalPercent = data.additionalPercent;
    }

    /**
     * Recalcular totalAmount y baseValue si se actualizó algún campo que afecta el cálculo
     */
    if (data.value !== undefined || data.additionalPercent !== undefined) {
      // Si se proporciona un nuevo value, buscar el WorkShiftCalculatedValue
      if (data.value !== undefined) {
        const calculatedValue = await db.workShiftCalculatedValue.findUnique({
          where: {
            coefficient_workShiftBaseValueId: {
              coefficient: data.value.coefficient,
              workShiftBaseValueId: data.value.workShiftBaseValueId,
            },
          },
        });

        if (!calculatedValue) {
          throw new NotFoundException(
            'Work shift calculated value not found for the given coefficient and base value',
          );
        }

        dataToUpdate.workShiftBaseValueId = data.value.workShiftBaseValueId;
        dataToUpdate.coefficient = data.value.coefficient;
        // baseValue = remunerated + notRemunerated (valor bruto total)
        dataToUpdate.baseValue = this.decimalService.add(
          calculatedValue.remunerated,
          calculatedValue.notRemunerated,
        );
      }

      // Obtener baseValue final (nuevo o existente)
      const finalBaseValue =
        dataToUpdate.baseValue ?? existingAssignment.baseValue;
      const finalAdditionalPercent =
        data.additionalPercent !== undefined
          ? data.additionalPercent
          : existingAssignment.additionalPercent;

      // Calcular totalAmount
      let totalAmount = finalBaseValue;

      if (finalAdditionalPercent) {
        const percentAmount = this.decimalService.multiply(
          finalBaseValue,
          this.decimalService.divide(finalAdditionalPercent, 100),
        );
        totalAmount = this.decimalService.add(finalBaseValue, percentAmount);
      }

      dataToUpdate.totalAmount = totalAmount;
    }

    const updatedAssignment = await db.workerAssignment.update({
      where: { id },
      data: dataToUpdate,
    });

    return updatedAssignment;
  }
}
