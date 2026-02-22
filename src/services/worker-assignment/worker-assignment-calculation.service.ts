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

    let gross = calculatedValue.gross;
    let net = calculatedValue.net;

    // Jornal caído: aplicar 70% tanto al bruto como al neto
    if (jc) {
      gross = this.decimalService.multiply(gross, 0.7);
      net = this.decimalService.multiply(net, 0.7);
    }

    // Aplicar porcentaje adicional solo al neto
    if (worker.additionalPercent) {
      const percentAmount = this.decimalService.multiply(
        net,
        this.decimalService.divide(worker.additionalPercent, 100),
      );
      net = this.decimalService.add(net, percentAmount);
    }

    return {
      id: this.uuidService.V6(),
      workerId: worker.workerId,
      category: worker.category,
      workShiftBaseValueId: worker.value.workShiftBaseValueId,
      coefficient: worker.value.coefficient,
      gross,
      additionalPercent: worker.additionalPercent ?? null,
      net,
    };
  }
}
