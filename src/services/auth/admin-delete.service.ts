import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common';
import { NotFoundException } from 'src/exceptions/common';

@Injectable()
export class AdminDeleteService {
  constructor(private readonly databaseService: DatabaseService) {}

  async delete(id: string) {
    const existingAdmin = await this.databaseService.admin.findUnique({
      where: { id },
    });

    if (!existingAdmin) {
      throw new NotFoundException('Admin not found');
    }

    // Eliminar sesiones relacionadas
    await this.databaseService.session.deleteMany({
      where: { adminId: id },
    });

    // Soft delete del admin
    await this.databaseService.admin.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Admin deleted successfully' };
  }
}
