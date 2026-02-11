import { Injectable } from '@nestjs/common';
import {
  DatabaseLocalityService,
  UuidService,
  DecimalService,
  LocalityResolverService,
} from '../common';
import type { CreateWorkerAssignment } from 'src/types/worker-assignment';
import type { LocalityOperationContext } from 'src/types/locality';
import type { Admin } from 'src/types/auth';
import { NotFoundException } from 'src/exceptions/common';

@Injectable()
export class WorkerAssignmentCreateService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly uuidService: UuidService,
    private readonly decimalService: DecimalService,
    private readonly localityResolver: LocalityResolverService,
  ) {}

  async create(
    admin: Pick<Admin, 'role' | 'localityId'>,
    data: CreateWorkerAssignment & LocalityOperationContext,
  ) {
    // localityId viene del body (data.localityId)
    const localityId = this.localityResolver.resolve(admin, data.localityId);
    const {
      workerId,
      workShiftId,
      date,
      category,
      value,
      additionalPercent,
      companyId,
      agencyId,
      terminalId,
      productId,
    } = data;

    const db = this.databaseService.getTenantClient(localityId);

    // Verificar que el trabajador existe
    const worker = await db.worker.findUnique({
      where: { id: workerId, deletedAt: null },
    });

    if (!worker) {
      throw new NotFoundException('Worker not found');
    }

    // Verificar que el turno existe
    const workShift = await db.workShift.findUnique({
      where: { id: workShiftId, deletedAt: null },
    });

    if (!workShift) {
      throw new NotFoundException('Work shift not found');
    }

    // Buscar el valor calculado exacto con el workShiftBaseValueId y coefficient
    const calculatedValue = await db.workShiftCalculatedValue.findUnique({
      where: {
        coefficient_workShiftBaseValueId: {
          coefficient: value.coefficient,
          workShiftBaseValueId: value.workShiftBaseValueId,
        },
      },
    });

    if (!calculatedValue) {
      throw new NotFoundException(
        'Work shift calculated value not found for the given coefficient and base value',
      );
    }

    /**
     * Calcular monto total:
     * 1. baseValue = calculatedValue.remunerated + calculatedValue.notRemunerated (valor bruto total)
     * 2. Si hay additionalPercent:
     *    - Si es positivo: totalAmount = baseValue + (baseValue * additionalPercent/100)
     *    - Si es negativo: totalAmount = baseValue - (baseValue * abs(additionalPercent)/100)
     *
     * Ejemplo 1: remunerated = 10000, notRemunerated = 2000, baseValue = 12000, additionalPercent = 15.00
     * - totalAmount = 12000 + (12000 * 15/100) = 12000 + 1800 = 13800
     *
     * Ejemplo 2: remunerated = 10000, notRemunerated = 2000, baseValue = 12000, additionalPercent = -10.00
     * - totalAmount = 12000 - (12000 * 10/100) = 12000 - 1200 = 10800
     */
    const baseValue = this.decimalService.add(
      calculatedValue.remunerated,
      calculatedValue.notRemunerated,
    );
    let totalAmount = baseValue;

    if (additionalPercent) {
      // Calcular el valor del porcentaje: baseValue * (additionalPercent / 100)
      const percentAmount = this.decimalService.multiply(
        baseValue,
        this.decimalService.divide(additionalPercent, 100),
      );

      // Sumar o restar según el signo del porcentaje
      totalAmount = this.decimalService.add(baseValue, percentAmount);
    }

    // Convertir fecha string a Date
    const assignmentDate = new Date(date);

    const assignment = await db.workerAssignment.create({
      data: {
        id: this.uuidService.V6(),
        workerId,
        workShiftId,
        date: assignmentDate,
        category,
        workShiftBaseValueId: value.workShiftBaseValueId,
        coefficient: value.coefficient,
        baseValue,
        additionalPercent: additionalPercent ?? null,
        totalAmount,
        companyId,
        localityId,
        agencyId,
        terminalId,
        productId,
      },
    });

    return assignment;
  }
}
