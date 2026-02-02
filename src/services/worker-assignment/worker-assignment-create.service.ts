import { Injectable } from '@nestjs/common';
import { DatabaseLocalityService, UuidService, DecimalService } from '../common';
import type { CreateWorkerAssignment } from 'src/types/worker-assignment';
import { NotFoundException } from 'src/exceptions/common';

@Injectable()
export class WorkerAssignmentCreateService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly uuidService: UuidService,
    private readonly decimalService: DecimalService,
  ) {}

  async create(data: CreateWorkerAssignment) {
    const { workerId, workShiftId, date, additionalPercent } = data;

    // Verificar que el trabajador existe
    const worker = await this.databaseService.worker.findUnique({
      where: { id: workerId, deletedAt: null },
    });

    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    // Verificar que el turno existe
    const workShift = await this.databaseService.workShift.findUnique({
      where: { id: workShiftId, deletedAt: null },
    });

    if (!workShift) {
      throw new NotFoundException('Work shift not found');
    }

    /**
     * Calcular monto total:
     * 1. Convertir durationMinutes a horas: durationMinutes / 60
     * 2. Calcular monto base: baseHourlyRate * durationHours
     * 3. Si hay additionalPercent, aplicar: montoBase * (1 + additionalPercent/100)
     *
     * Ejemplo: baseHourlyRate = 1500, durationMinutes = 480 (8 horas), additionalPercent = 15
     * - durationHours = 480 / 60 = 8
     * - montoBase = 1500 * 8 = 12000
     * - totalAmount = 12000 * (1 + 15/100) = 12000 * 1.15 = 13800
     */
    const durationHours = this.decimalService.divide(
      this.decimalService.create(workShift.durationMinutes),
      60,
    );

    const baseAmount = this.decimalService.multiply(
      worker.baseHourlyRate,
      durationHours,
    );

    let totalAmount = baseAmount;

    if (additionalPercent) {
      // Calcular porcentaje: 1 + (additionalPercent / 100)
      const percentMultiplier = this.decimalService.add(
        this.decimalService.create(1),
        this.decimalService.divide(additionalPercent, 100),
      );

      totalAmount = this.decimalService.multiply(baseAmount, percentMultiplier);
    }

    // Convertir fecha string a Date
    const assignmentDate = new Date(date);

    const assignment = await this.databaseService.workerAssignment.create({
      data: {
        id: this.uuidService.V6(),
        workerId,
        workShiftId,
        date: assignmentDate,
        additionalPercent: additionalPercent ?? null,
        totalAmount,
      },
    });

    return assignment;
  }
}
