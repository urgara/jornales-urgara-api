import { Injectable } from '@nestjs/common';
import { DatabaseCommonService, HashService } from '../common';
import type { Admin, ChangePassword } from 'src/types/auth';
import { UnauthorizedException } from 'src/exceptions/common/auth';
import { NotFoundException } from 'src/exceptions/common';

@Injectable()
export class ChangePasswordService {
  constructor(
    private readonly databaseService: DatabaseCommonService,
    private readonly hashService: HashService,
  ) {}

  async changePassword(
    adminId: string,
    data: ChangePassword,
  ): Promise<{ success: boolean }> {
    // Buscar el admin
    const admin = await this.databaseService.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // Verificar contraseña actual
    const isPasswordValid = await this.hashService.compare(
      data.currentPassword,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hashear nueva contraseña
    const hashedNewPassword = await this.hashService.hash(data.newPassword);

    // Actualizar contraseña
    await this.databaseService.admin.update({
      where: { id: adminId },
      data: {
        password: hashedNewPassword,
      },
    });

    return { success: true };
  }
}
