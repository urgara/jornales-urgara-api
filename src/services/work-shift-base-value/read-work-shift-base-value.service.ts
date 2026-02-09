import { Injectable } from '@nestjs/common';
import { DatabaseLocalityService, LocalityResolverService } from '../common';
import type {
  FindWorkShiftBaseValueQuery,
  WorkShiftBaseValueId,
} from 'src/types/work-shift-base-value';
import type { Admin } from 'src/types/auth';
import { Prisma } from '../../../generated/prisma-locality';
import { NotFoundException } from 'src/exceptions/common';

@Injectable()
export class ReadWorkShiftBaseValueService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly localityResolver: LocalityResolverService,
  ) {}

  async findAll(
    admin: Pick<Admin, 'role' | 'localityId'>,
    query?: FindWorkShiftBaseValueQuery,
  ) {
    const localityId = this.localityResolver.resolve(admin, query?.localityId);
    const {
      page = 1,
      limit = 10,
      sortBy = 'startDate',
      sortOrder = 'desc',
    } = query || {};

    const skip = (page - 1) * limit;

    const orderBy: Prisma.WorkShiftBaseValueOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const db = this.databaseService.getTenantClient(localityId);
    const [baseValues, total] = await Promise.all([
      db.workShiftBaseValue.findMany({
        skip,
        take: limit,
        orderBy,
        include: { workShiftCalculatedValues: true },
      }),
      db.workShiftBaseValue.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: baseValues,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findById(
    id: WorkShiftBaseValueId,
    admin: Pick<Admin, 'role' | 'localityId'>,
    queryLocalityId?: string,
  ) {
    const localityId = this.localityResolver.resolve(admin, queryLocalityId);
    const db = this.databaseService.getTenantClient(localityId);

    const baseValue = await db.workShiftBaseValue.findUnique({
      where: { id },
      include: { workShiftCalculatedValues: true },
    });

    if (!baseValue) {
      throw new NotFoundException('Work shift base value not found');
    }

    return baseValue;
  }
}
