import { Injectable } from '@nestjs/common';
import { DatabaseCommonService } from '../common';
import type {
  AdminClientToken,
  FindAdminsQuery,
  PrismaAdmin,
} from 'src/types/auth';
import { Prisma } from '../../../generated/prisma-common';
import { NotFoundException } from 'src/exceptions/common';
import { SecurityAlertException } from 'src/exceptions/common/auth';

@Injectable()
export class AdminReadService {
  constructor(private readonly databaseService: DatabaseCommonService) {}

  async findAll(query?: FindAdminsQuery) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'asc',
      name,
      surname,
      dni,
      role,
    } = query || {};

    const skip = (page - 1) * limit;

    const where: Prisma.AdminWhereInput = {};

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
      };
    }

    if (role) {
      // Cast necesario por bug de Prisma 7 con enums mapeados
      where.role = role as unknown as PrismaAdmin['role'];
    }

    const [admins, total] = await Promise.all([
      this.databaseService.admin.findMany({
        where,
        select: {
          id: true,
          name: true,
          surname: true,
          dni: true,
          localityId: true,
          role: true,
          createdAt: true,
          deletedAt: true,
          Locality: {
            select: {
              id: true,
              name: true,
              province: true,
              isCalculateJc: true,
              createdAt: true,
              deletedAt: true,
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip,
        take: limit,
      }),
      this.databaseService.admin.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: admins,
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

  async findAdminByCookie(data: AdminClientToken) {
    const session = await this.databaseService.session.findUnique({
      where: { id: data.sessionId },
    });
    if (!session) {
      throw new SecurityAlertException('Session not found');
    }
    const admin = await this.databaseService.admin.findUnique({
      where: { id: session?.adminId },
      select: {
        id: true,
        name: true,
        surname: true,
        dni: true,
        localityId: true,
        role: true,
        createdAt: true,
        deletedAt: true,
        Locality: {
          select: {
            id: true,
            name: true,
            province: true,
            isCalculateJc: true,
            createdAt: true,
            deletedAt: true,
          },
        },
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin;
  }
}
