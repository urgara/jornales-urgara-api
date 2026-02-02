import { Injectable } from '@nestjs/common';
import { DatabaseCommonService } from '../common';
import { NotFoundException } from 'src/exceptions/common';
import type { Prisma } from '../../../generated/prisma-common';
import type { CompanyId, FindCompaniesQuery } from 'src/types/company';

@Injectable()
export class CompanyReadService {
  constructor(private readonly databaseService: DatabaseCommonService) {}

  async findById(id: CompanyId) {
    const company = await this.databaseService.company.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        LegalEntity: true,
      },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }

  async findAllCompanies(query?: FindCompaniesQuery) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      name,
      cuit,
      legalEntityId,
    } = query || {};

    const where: Prisma.CompanyWhereInput = {
      deletedAt: null,
    };

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    if (cuit) {
      where.cuit = {
        contains: cuit,
        mode: 'insensitive',
      };
    }

    if (legalEntityId !== undefined) {
      where.legalEntityId = legalEntityId;
    }

    const [data, total] = await Promise.all([
      this.databaseService.company.findMany({
        where,
        include: {
          LegalEntity: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      this.databaseService.company.count({ where }),
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

  async selectCompanies() {
    return await this.databaseService.company.findMany({
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
