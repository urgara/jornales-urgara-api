import { Injectable } from '@nestjs/common';
import { DatabaseLocalityService, LocalityResolverService } from '../common';
import type { FindWorkShiftQuery, WorkShiftId } from 'src/types/work-shift';
import type { Admin } from 'src/types/auth';
import { Prisma } from '../../../generated/prisma-locality';
import { NotFoundException } from 'src/exceptions/common';

@Injectable()
export class ReadWorkShiftsService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly localityResolver: LocalityResolverService,
  ) {}

  async findAllWorkShifts(
    admin: Pick<Admin, 'role' | 'localityId'>,
    query?: FindWorkShiftQuery,
  ) {
    const localityId = this.localityResolver.resolve(admin, query?.localityId);
    const {
      page = 1,
      limit = 10,
      sortBy = 'description',
      sortOrder = 'asc',
      description,
    } = query || {};

    const skip = (page - 1) * limit;

    const where: Prisma.WorkShiftWhereInput = {
      deletedAt: null,
    };

    if (description) {
      where.description = {
        contains: description,
        mode: 'insensitive',
      };
    }

    const orderBy: Prisma.WorkShiftOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const db = this.databaseService.getTenantClient(localityId);
    const [workShifts, total] = await Promise.all([
      db.workShift.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      db.workShift.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: workShifts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async selectWorkShifts(
    admin: Pick<Admin, 'role' | 'localityId'>,
    queryLocalityId?: string,
  ) {
    const localityId = this.localityResolver.resolve(admin, queryLocalityId);
    const db = this.databaseService.getTenantClient(localityId);
    return await db.workShift.findMany({
      where: { deletedAt: null },
      orderBy: {
        description: 'asc',
      },
    });
  }

  async findById(
    id: WorkShiftId,
    admin: Pick<Admin, 'role' | 'localityId'>,
    queryLocalityId?: string,
  ) {
    const localityId = this.localityResolver.resolve(admin, queryLocalityId);
    const db = this.databaseService.getTenantClient(localityId);
    const workShift = await db.workShift.findUnique({
      where: { id, deletedAt: null },
    });

    if (!workShift) {
      throw new NotFoundException('Work shift not found');
    }

    return workShift;
  }
}
