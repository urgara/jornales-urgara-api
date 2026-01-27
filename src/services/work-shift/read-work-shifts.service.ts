import { Injectable } from '@nestjs/common';
import { DatabaseService, DateService } from '../common';
import type {
  FindWorkShiftQuery,
  FindBaseValueWorkShiftQuery,
  WorkShiftId,
} from 'src/types/work-shift';
import { Prisma } from '../../../generated/prisma/client';
import { NotFoundException } from 'src/exceptions/common';
import { PortId } from '../../types/port';

@Injectable()
export class ReadWorkShiftsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly dateService: DateService,
  ) {}

  async findAllWorkShifts(query?: FindWorkShiftQuery) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      description,
      createdAt,
      deletedAt,
    } = query || {};

    const skip = (page - 1) * limit;

    const where: Prisma.WorkShiftWhereInput = {};

    if (description) {
      where.description = {
        contains: description,
        mode: 'insensitive',
      };
    }

    if (createdAt !== undefined) {
      where.createdAt = createdAt;
    }

    if (deletedAt !== undefined) {
      where.deletedAt = deletedAt;
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
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async selectWorkShifts() {
    return await this.databaseService.workShift.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        days: true,
        startTime: true,
        endTime: true,
        description: true,
        coefficient: true,
      },
    });
  }

  async selectValueWorkShifts(portId: PortId, date?: string) {
    let baseValueWorkShiftWhere: Prisma.BaseValueWorkShiftWhereInput = {
      portId,
    };
    if (date) {
      // Crear fecha con hora del mediodía para evitar problemas de zona horaria
      const dateStr = new Date(date).toISOString().split('T')[0];
      const filterDate = new Date(`${dateStr}T12:00:00.000Z`);

      const endOfDayDate = this.dateService.toArgentinaEndOfDay(filterDate);
      baseValueWorkShiftWhere = {
        portId,
        startDate: { lte: endOfDayDate },
        OR: [{ endDate: { gte: filterDate } }, { endDate: null }],
      };
    } else {
      baseValueWorkShiftWhere = {
        portId,
        endDate: null,
      };
    }

    const where: Prisma.ValueWorkShiftWhereInput = {
      BaseValueWorkShift: baseValueWorkShiftWhere,
    };

    return await this.databaseService.valueWorkShift.findMany({
      where,
      include: {
        BaseValueWorkShift: { include: { Category: true } },
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

  async findAllBaseValueWorkShifts(query?: FindBaseValueWorkShiftQuery) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'startDate',
      sortOrder = 'desc',
      portId,
      categoryId,
      startDate,
      endDate,
    } = query || {};

    const skip = (page - 1) * limit;

    const where: Prisma.BaseValueWorkShiftWhereInput = {};

    if (portId !== undefined) {
      where.portId = portId;
    }

    if (categoryId !== undefined) {
      where.categoryId = categoryId;
    }

    if (startDate !== undefined) {
      where.startDate = startDate;
    }

    if (endDate !== undefined) {
      where.endDate = endDate;
    }

    const orderBy: Prisma.BaseValueWorkShiftOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [baseValueWorkShifts, total] = await Promise.all([
      this.databaseService.baseValueWorkShift.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          ValueWorkShift: {
            include: {
              WorkShift: true,
            },
          },
        },
      }),
      this.databaseService.baseValueWorkShift.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: baseValueWorkShifts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }
}
