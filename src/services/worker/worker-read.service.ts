import { Injectable } from '@nestjs/common';
import { DatabaseLocalityService, LocalityResolverService } from '../common';
import { NotFoundException } from 'src/exceptions/common';
import type { Prisma } from '../../../generated/prisma-locality';
import type { WorkerId, FindWorkersQuery } from 'src/types/worker';
import type { Admin } from 'src/types/auth';

@Injectable()
export class WorkerReadService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly localityResolver: LocalityResolverService,
  ) {}

  async findById(
    id: WorkerId,
    admin: Pick<Admin, 'role' | 'localityId'>,
    queryLocalityId?: string,
  ) {
    const localityId = this.localityResolver.resolve(admin, queryLocalityId);
    const db = this.databaseService.getTenantClient(localityId);
    const worker = await db.worker.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!worker) {
      throw new NotFoundException(`Worker with ID ${id} not found`);
    }

    return worker;
  }

  async findAllWorkers(
    admin: Pick<Admin, 'role' | 'localityId'>,
    query?: FindWorkersQuery,
  ) {
    const localityId = this.localityResolver.resolve(admin, query?.localityId);
    const {
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      name,
      surname,
      dni,
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

    // localityId filter is applied at DB routing level via getTenantClient
    // No need to filter by localityId in the WHERE clause

    const db = this.databaseService.getTenantClient(localityId);
    const [data, total] = await Promise.all([
      db.worker.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      db.worker.count({ where }),
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

  async selectWorkers(
    admin: Pick<Admin, 'role' | 'localityId'>,
    queryLocalityId?: string,
  ) {
    const localityId = this.localityResolver.resolve(admin, queryLocalityId);
    const db = this.databaseService.getTenantClient(localityId);
    return await db.worker.findMany({
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

  async count(
    admin: Pick<Admin, 'role' | 'localityId'>,
    queryLocalityId?: string,
  ): Promise<number> {
    const localityId = this.localityResolver.resolve(admin, queryLocalityId);
    const db = this.databaseService.getTenantClient(localityId);
    return await db.worker.count({
      where: {
        deletedAt: null,
      },
    });
  }
}
