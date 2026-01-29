import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common';
import type { FindWorkShiftQuery, WorkShiftId } from 'src/types/work-shift';
import { Prisma } from '../../../generated/prisma/client';
import { NotFoundException } from 'src/exceptions/common';

@Injectable()
export class ReadWorkShiftsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAllWorkShifts(query?: FindWorkShiftQuery) {
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

    const [workShifts, total] = await Promise.all([
      this.databaseService.workShift.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.databaseService.workShift.count({ where }),
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

  async selectWorkShifts() {
    return await this.databaseService.workShift.findMany({
      where: { deletedAt: null },
      orderBy: {
        description: 'asc',
      },
    });
  }

  async findById(id: WorkShiftId) {
    const workShift = await this.databaseService.workShift.findUnique({
      where: { id, deletedAt: null },
    });

    if (!workShift) {
      throw new NotFoundException('Work shift not found');
    }

    return workShift;
  }
}
