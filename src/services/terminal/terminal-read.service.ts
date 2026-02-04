import { Injectable } from '@nestjs/common';
import { DatabaseLocalityService } from '../common';
import { NotFoundException } from 'src/exceptions/common';
import type { Prisma } from '../../../generated/prisma-locality';
import type { TerminalId, FindTerminalsQuery } from 'src/types/terminal';

@Injectable()
export class TerminalReadService {
  constructor(private readonly databaseService: DatabaseLocalityService) {}

  async findById(id: TerminalId) {
    const terminal = await this.databaseService.terminal.findFirst({
      where: {
        id,
      },
    });

    if (!terminal) {
      throw new NotFoundException(`Terminal with ID ${id} not found`);
    }

    return terminal;
  }

  async findAllTerminals(query?: FindTerminalsQuery) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      name,
    } = query || {};

    const where: Prisma.TerminalWhereInput = {};

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    const [data, total] = await Promise.all([
      this.databaseService.terminal.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.databaseService.terminal.count({ where }),
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

  async selectTerminals() {
    return await this.databaseService.terminal.findMany({
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
