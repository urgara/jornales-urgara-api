import { Injectable } from '@nestjs/common';
import { DatabaseCommonService, HashService } from '../common';
import type { UpdateAdmin, PrismaAdmin, Admin, AdminId } from 'src/types/auth';
import { AdminRole } from 'src/types/auth';
import { NotFoundException } from 'src/exceptions/common';
import { ForbiddenException } from 'src/exceptions/common/auth';

@Injectable()
export class AdminUpdateService {
  constructor(
    private readonly databaseService: DatabaseCommonService,
    private readonly hashService: HashService,
  ) {}

  async update(
    id: string,
    updateData: UpdateAdmin,
    requestingAdmin: Pick<Admin, 'role'> & { sessionId: string },
  ) {
    const existingAdmin = await this.databaseService.admin.findUnique({
      where: { id },
    });

    if (!existingAdmin) {
      throw new NotFoundException('Admin not found');
    }

    // Solo ADMIN puede cambiar localityId
    if (
      'localityId' in updateData &&
      requestingAdmin.role !== AdminRole.ADMIN
    ) {
      throw new ForbiddenException(
        'Only ADMIN role can change locality assignment',
      );
    }

    const updatePayload: UpdateAdmin = { ...updateData };

    if (updateData.password) {
      updatePayload.password = await this.hashService.hash(updateData.password);
    }

    const updatedAdmin = await this.databaseService.admin.update({
      where: { id },
      // Cast necesario por bug de Prisma 7 con enums mapeados
      data: updatePayload as Partial<PrismaAdmin>,
      select: {
        id: true,
        name: true,
        surname: true,
        dni: true,
        role: true,
      },
    });

    return updatedAdmin;
  }
}
