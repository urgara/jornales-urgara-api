import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common';
import type {
  WorkerAssignmentId,
  FindWorkerAssignmentQuery,
} from 'src/types/worker-assignment';
import { NotFoundException } from 'src/exceptions/common';

@Injectable()
export class WorkerAssignmentReadService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findById(id: WorkerAssignmentId) {
    const assignment = await this.databaseService.workerAssignment.findUnique({
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

  async findAll(query: FindWorkerAssignmentQuery) {
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

    const [assignments, total] = await Promise.all([
      this.databaseService.workerAssignment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.databaseService.workerAssignment.count({ where }),
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
}
