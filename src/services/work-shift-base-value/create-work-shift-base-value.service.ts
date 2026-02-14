import { Injectable } from '@nestjs/common';
import {
  DatabaseLocalityService,
  DecimalService,
  UuidService,
  LocalityResolverService,
} from '../common';
import type { CreateWorkShiftBaseValue } from 'src/types/work-shift-base-value';
import type { LocalityOperationContext } from 'src/types/locality';
import type { Admin } from 'src/types/auth';

@Injectable()
export class CreateWorkShiftBaseValueService {
  COEF_REM = 0.795;
  COEF_NO_REM = 0.965;
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly uuidService: UuidService,
    private readonly localityResolver: LocalityResolverService,
    private readonly decimalService: DecimalService,
  ) {}

  async create(
    admin: Pick<Admin, 'role' | 'localityId'>,
    data: CreateWorkShiftBaseValue & LocalityOperationContext,
  ) {
    const localityId = this.localityResolver.resolve(admin, data.localityId);
    const {
      remunerated,
      notRemunerated,
      startDate,
      endDate,
      category,
      coefficients,
    } = data;

    const id = this.uuidService.V6();
    const db = this.databaseService.getTenantClient(localityId);

    const baseValue = await db.workShiftBaseValue.create({
      data: {
        id,
        remunerated,
        notRemunerated,
        startDate: new Date(new Date(startDate).setUTCHours(3, 0, 0, 0)),
        endDate: new Date(new Date(endDate).setUTCHours(2, 59, 59, 999)),
        category,
        workShiftCalculatedValues: {
          create: coefficients.map((coefficient) => {
            const calcRemunerated = this.decimalService.multiply(
              remunerated,
              coefficient,
            );
            const calcNotRemunerated = this.decimalService.multiply(
              notRemunerated,
              coefficient,
            );
            const gross = this.decimalService.add(
              calcRemunerated,
              calcNotRemunerated,
            );
            const net = this.decimalService.add(
              this.decimalService.multiply(calcRemunerated, this.COEF_REM),
              this.decimalService.multiply(
                calcNotRemunerated,
                this.COEF_NO_REM,
              ),
            );

            return {
              coefficient,
              remunerated: calcRemunerated,
              notRemunerated: calcNotRemunerated,
              gross,
              net,
            };
          }),
        },
      },
      include: { workShiftCalculatedValues: true },
    });

    return baseValue;
  }
}
