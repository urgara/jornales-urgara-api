import { Injectable } from '@nestjs/common';
import {
  DatabaseLocalityService,
  DatabaseCommonService,
  LocalityResolverService,
} from '../common';
import type {
  WorkerAssignmentId,
  FindWorkerAssignmentQuery,
} from 'src/types/worker-assignment';
import type { Admin } from 'src/types/auth';
import { NotFoundException } from 'src/exceptions/common';

@Injectable()
export class WorkerAssignmentReadService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly databaseCommon: DatabaseCommonService,
    private readonly localityResolver: LocalityResolverService,
  ) {}

  async findById(
    id: WorkerAssignmentId,
    admin: Pick<Admin, 'role' | 'localityId'>,
    queryLocalityId?: string,
  ) {
    const localityId = this.localityResolver.resolve(admin, queryLocalityId);
    const db = this.databaseService.getTenantClient(localityId);
    const assignment = await db.workerAssignment.findUnique({
      where: { id },
      include: {
        WorkShift: true,
        WorkerAssignmentDetail: {
          include: { Worker: true },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException('Worker assignment not found');
    }

    // Buscar nombre del barco en la DB común
    const ship = await this.databaseCommon.ship.findUnique({
      where: { id: assignment.shipId },
      select: { name: true },
    });

    // Mapear WorkerAssignmentDetail → workers
    const { WorkerAssignmentDetail, ...header } = assignment;
    return { ...header, shipName: ship?.name ?? '', workers: WorkerAssignmentDetail };
  }

  async findAll(
    admin: Pick<Admin, 'role' | 'localityId'>,
    query: FindWorkerAssignmentQuery,
  ) {
    const localityId = this.localityResolver.resolve(admin, query?.localityId);
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      workerId,
      workShiftId,
      companyId,
      companyRole,
      terminalId,
      productId,
      shipId,
      dateFrom,
      dateTo,
    } = query;

    const skip = (page - 1) * limit;

    const where: any = {};

    // workerId filtra vía relación detail
    if (workerId) {
      where.WorkerAssignmentDetail = { some: { workerId } };
    }

    if (workShiftId) {
      where.workShiftId = workShiftId;
    }

    if (companyId) {
      where.companyId = companyId;
    }

    if (companyRole) {
      where.companyRole = companyRole;
    }

    if (terminalId) {
      where.terminalId = terminalId;
    }

    if (productId) {
      where.productId = productId;
    }

    if (shipId) {
      where.shipId = shipId;
    }

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) {
        where.date.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.date.lte = new Date(dateTo);
      }
    }

    const db = this.databaseService.getTenantClient(localityId);
    const [assignments, total] = await Promise.all([
      db.workerAssignment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: { WorkerAssignmentDetail: true },
      }),
      db.workerAssignment.count({ where }),
    ]);

    // Recolectar shipIds únicos para una sola consulta batch
    const uniqueShipIds = [
      ...new Set(assignments.map((a: any) => a.shipId as string)),
    ];

    const ships = await this.databaseCommon.ship.findMany({
      where: { id: { in: uniqueShipIds } },
      select: { id: true, name: true },
    });

    const shipNameMap = new Map(ships.map((s) => [s.id, s.name]));

    // Mapear WorkerAssignmentDetail → workers + shipName
    const mappedAssignments = assignments.map((assignment: any) => {
      const { WorkerAssignmentDetail, ...header } = assignment;
      return {
        ...header,
        shipName: shipNameMap.get(header.shipId) ?? '',
        workers: WorkerAssignmentDetail,
      };
    });

    return {
      data: mappedAssignments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async count(
    admin: Pick<Admin, 'role' | 'localityId'>,
    queryLocalityId?: string,
  ): Promise<number> {
    const localityId = this.localityResolver.resolve(admin, queryLocalityId);
    const db = this.databaseService.getTenantClient(localityId);
    return await db.workerAssignment.count();
  }
}
