import { Injectable } from '@nestjs/common';
import { DecimalService, UuidService } from '../common';
import type { CreateWorkerAssignmentWorker } from 'src/types/worker-assignment';
import { NotFoundException } from 'src/exceptions/common';

@Injectable()
export class WorkerAssignmentCalculationService {
  constructor(
    private readonly decimalService: DecimalService,
    private readonly uuidService: UuidService,
  ) {}

  async calculateWorkerDetail(
    db: any,
    worker: CreateWorkerAssignmentWorker,
    jc = false,
  ) {
    const calculatedValue = await db.workShiftCalculatedValue.findUnique({
      where: {
        coefficient_workShiftBaseValueId: {
          coefficient: worker.value.coefficient,
          workShiftBaseValueId: worker.value.workShiftBaseValueId,
        },
      },
    });

    if (!calculatedValue) {
      throw new NotFoundException(
        `Work shift calculated value not found for worker ${worker.workerId} with coefficient ${worker.value.coefficient} and base value ${worker.value.workShiftBaseValueId}`,
      );
    }

    let baseValue = this.decimalService.add(
      calculatedValue.remunerated,
      calculatedValue.notRemunerated,
    );

    // Jornal caído: aplicar 70% al bruto primero, el neto se deriva de ese bruto
    if (jc) {
      baseValue = this.decimalService.multiply(baseValue, 0.7);
    }

    let totalAmount = baseValue;

    if (worker.additionalPercent) {
      const percentAmount = this.decimalService.multiply(
        baseValue,
        this.decimalService.divide(worker.additionalPercent, 100),
      );
      totalAmount = this.decimalService.add(baseValue, percentAmount);
    }

    return {
      id: this.uuidService.V6(),
      workerId: worker.workerId,
      category: worker.category,
      workShiftBaseValueId: worker.value.workShiftBaseValueId,
      coefficient: worker.value.coefficient,
      baseValue,
      additionalPercent: worker.additionalPercent ?? null,
      totalAmount,
    };
  }
}
