import { Injectable } from '@nestjs/common';
import { DatabaseLocalityService, LocalityResolverService } from '../common';
import type {
  WorkerAssignmentId,
  FindWorkerAssignmentQuery,
} from 'src/types/worker-assignment';
import type { Admin } from 'src/types/auth';
import { NotFoundException } from 'src/exceptions/common';

@Injectable()
export class WorkerAssignmentReadService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly localityResolver: LocalityResolverService,
  ) {}

  async findById(
    id: WorkerAssignmentId,
    admin: Pick<Admin, 'role' | 'localityId'>,
    queryLocalityId?: string,
  ) {
    const localityId = this.localityResolver.resolve(admin, queryLocalityId);
    const db = this.databaseService.getTenantClient(localityId);
    const assignment = await db.workerAssignment.findUnique({
      where: { id },
      include: {
        Worker: true,
        WorkShift: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException('Worker assignment not found');
    }

    return assignment;
  }

  async findAll(
    admin: Pick<Admin, 'role' | 'localityId'>,
    query: FindWorkerAssignmentQuery,
  ) {
    const localityId = this.localityResolver.resolve(admin, query?.localityId);
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      workerId,
      workShiftId,
      dateFrom,
      dateTo,
    } = query;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (workerId) {
      where.workerId = workerId;
    }

    if (workShiftId) {
      where.workShiftId = workShiftId;
    }

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) {
        where.date.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.date.lte = new Date(dateTo);
      }
    }

    const db = this.databaseService.getTenantClient(localityId);
    const [assignments, total] = await Promise.all([
      db.workerAssignment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      db.workerAssignment.count({ where }),
    ]);

    return {
      data: assignments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async count(
    admin: Pick<Admin, 'role' | 'localityId'>,
    queryLocalityId?: string,
  ): Promise<number> {
    const localityId = this.localityResolver.resolve(admin, queryLocalityId);
    const db = this.databaseService.getTenantClient(localityId);
    return await db.workerAssignment.count();
  }
}
