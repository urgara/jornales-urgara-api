import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common';
import type { Locality } from 'src/types/locality';
import { Prisma } from '../../../generated/prisma/client';
import { NotFoundException } from 'src/exceptions/common';

@Injectable()
export class LocalityReadService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc',
    name?: string,
    province?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: Prisma.LocalityWhereInput = {
      deletedAt: null,
      ...(name && {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      }),
      ...(province && {
        province: {
          contains: province,
          mode: 'insensitive',
        },
      }),
    };

    const [localities, total] = await Promise.all([
      this.databaseService.locality.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.databaseService.locality.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: localities,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findById(id: number): Promise<Locality> {
    const locality = await this.databaseService.locality.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!locality) {
      throw new NotFoundException(`Locality with ID ${id} not found`);
    }

    return locality;
  }

  async findByName(name: string): Promise<Locality | null> {
    return this.databaseService.locality.findFirst({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
        deletedAt: null,
      },
    });
  }

  async select() {
    return this.databaseService.locality.findMany({
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
