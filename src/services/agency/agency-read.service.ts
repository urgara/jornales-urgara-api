import { Injectable } from '@nestjs/common';
import { DatabaseCommonService } from '../common';
import { NotFoundException } from 'src/exceptions/common';
import type { Prisma } from '../../../generated/prisma-common';
import type { AgencyId, FindAgenciesQuery } from 'src/types/agency';

@Injectable()
export class AgencyReadService {
  constructor(private readonly databaseService: DatabaseCommonService) {}

  async findById(id: AgencyId) {
    const agency = await this.databaseService.agency.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!agency) {
      throw new NotFoundException(`Agency with ID ${id} not found`);
    }

    return agency;
  }

  async findAllAgencies(query?: FindAgenciesQuery) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      name,
    } = query || {};

    const where: Prisma.AgencyWhereInput = {
      deletedAt: null,
    };

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    const [data, total] = await Promise.all([
      this.databaseService.agency.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.databaseService.agency.count({ where }),
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

  async selectAgencies() {
    return await this.databaseService.agency.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
