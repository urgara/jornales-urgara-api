import { Injectable } from '@nestjs/common';
import { DatabaseCommonService } from '../common';
import { NotFoundException } from 'src/exceptions/common';
import type { Prisma } from '../../../generated/prisma-common';
import type { ShipId, FindShipsQuery } from 'src/types/ship';

@Injectable()
export class ShipReadService {
  constructor(private readonly databaseService: DatabaseCommonService) {}

  async findById(id: ShipId) {
    const ship = await this.databaseService.ship.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!ship) {
      throw new NotFoundException(`Ship with ID ${id} not found`);
    }

    return ship;
  }

  async findAllShips(query?: FindShipsQuery) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      name,
    } = query || {};

    const where: Prisma.ShipWhereInput = {
      deletedAt: null,
    };

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    const [data, total] = await Promise.all([
      this.databaseService.ship.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.databaseService.ship.count({ where }),
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

  async selectShips() {
    return await this.databaseService.ship.findMany({
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

  async count(): Promise<number> {
    return await this.databaseService.ship.count({
      where: {
        deletedAt: null,
      },
    });
  }
}
