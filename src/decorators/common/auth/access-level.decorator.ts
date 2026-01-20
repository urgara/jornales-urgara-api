import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard, RoleGuard } from '../../../guards/common/auth';
import type { AdminTypeRole } from 'src/types/auth';

export const ROLE_KEY = 'Role'; // Clave para los metadatos

export const AccessLevel = (role: AdminTypeRole) => {
  return applyDecorators(
    ApiBearerAuth(),
    SetMetadata(ROLE_KEY, role),
    UseGuards(JwtGuard, RoleGuard),
  );
};
