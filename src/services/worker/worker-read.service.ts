import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common';
import { NotFoundException } from 'src/exceptions/common';
import type { Prisma } from '../../../generated/prisma/client';
import type { WorkerId, FindWorkersQuery } from 'src/types/worker';

@Injectable()
export class WorkerReadService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findById(id: WorkerId) {
    const worker = await this.databaseService.worker.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        Company: true,
        Locality: true,
      },
    });

    if (!worker) {
      throw new NotFoundException(`Worker with ID ${id} not found`);
    }

    return worker;
  }

  async findAllWorkers(query?: FindWorkersQuery) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      name,
      surname,
      dni,
      companyId,
      localityId,
    } = query || {};

    const where: Prisma.WorkerWhereInput = {
      deletedAt: null,
    };

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (surname) {
      where.surname = {
        contains: surname,
        mode: 'insensitive',
      };
    }

    if (dni) {
      where.dni = {
        contains: dni,
        mode: 'insensitive',
      };
    }

    if (companyId !== undefined) {
      where.companyId = companyId;
    }

    if (localityId !== undefined) {
      where.localityId = localityId;
    }

    const [data, total] = await Promise.all([
      this.databaseService.worker.findMany({
        where,
        include: {
          Company: true,
          Locality: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.databaseService.worker.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async selectWorkers() {
    return await this.databaseService.worker.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        surname: true,
        dni: true,
      },
      orderBy: {
        surname: 'asc',
      },
    });
  }
}
