import { Injectable } from '@nestjs/common';
import { DatabaseService, HashService } from '../common';
import type { UpdateAdmin, PrismaAdmin } from 'src/types/auth';
import { NotFoundException } from 'src/exceptions/common';

@Injectable()
export class AdminUpdateService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly hashService: HashService,
  ) {}

  async update(id: string, updateData: UpdateAdmin) {
    const existingAdmin = await this.databaseService.admin.findUnique({
      where: { id },
    });

    if (!existingAdmin) {
      throw new NotFoundException('Admin not found');
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
