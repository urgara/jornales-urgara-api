import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { ReqAdmin } from '../../../types/auth/request.type';
import { AdminRole } from 'src/types/auth';
import { ForbiddenException } from 'src/exceptions/common/auth';
import { IS_PUBLIC_KEY } from '../../../decorators/common/auth';
import { DatabaseLocalityService } from 'src/services/common/database-locality.service';

/**
 * LocalityGuard - Valida que el admin tenga acceso a una localidad con conexión activa
 *
 * Reglas de validación (multi-tenant):
 * 1. ADMIN global (sin localityId) → Acceso a TODAS las localidades
 * 2. Admin con localityId → Debe existir una conexión activa en DatabaseLocalityService
 * 3. LOCAL admin sin localityId → ERROR (todos los LOCAL deben tener localidad asignada)
 */
@Injectable()
export class LocalityGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly databaseLocalityService: DatabaseLocalityService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Verificar si la ruta está marcada como pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    // Obtener el admin del request (añadido por JwtGuard)
    const request: ReqAdmin = context.switchToHttp().getRequest();
    const { admin } = request;

    // Si no hay admin en el request, el JwtGuard debería haberlo bloqueado
    if (!admin) {
      throw new ForbiddenException('Authentication required');
    }

    // REGLA 1: ADMIN global (sin localityId) → Acceso a TODAS las localidades
    if (admin.role === AdminRole.ADMIN && !admin.localityId) {
      return true;
    }

    // REGLA 2: LOCAL admin sin localityId → ERROR (debe tener localidad asignada)
    if (admin.role === AdminRole.LOCAL && !admin.localityId) {
      throw new ForbiddenException('LOCAL admin must have a locality assigned');
    }

    // REGLA 3: Validar que el localityId del admin tenga una conexión activa
    if (admin.localityId) {
      try {
        this.databaseLocalityService.getTenantClient(admin.localityId);
      } catch {
        throw new ForbiddenException(
          `Access denied. No active database connection for locality ${admin.localityId}`,
        );
      }
    }

    return true;
  }
}
