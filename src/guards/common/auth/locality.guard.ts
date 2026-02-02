import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import type { ApiConfig } from '../../../config';
import type { ReqAdmin } from '../../../types/auth/request.type';
import { AdminRole } from 'src/types/auth';
import { ForbiddenException } from 'src/exceptions/common/auth';
import { IS_PUBLIC_KEY } from '../../../decorators/common/auth';

/**
 * LocalityGuard - Valida que el admin tenga acceso a esta instancia basándose en su localityId
 *
 * Reglas de validación:
 * 1. ADMIN global (sin localityId) → Acceso a TODAS las instancias
 * 2. LOCAL admin → Solo puede acceder si su localityId coincide con el LOCALITY_ID de la instancia
 * 3. Instancia sin LOCALITY_ID configurado → ERROR de configuración (todas las instancias deben tener localidad)
 * 4. LOCAL admin sin localityId → ERROR (todos los LOCAL deben tener localidad asignada)
 */
@Injectable()
export class LocalityGuard implements CanActivate {
  private readonly apiConfig: ApiConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {
    this.apiConfig = this.configService.get<ApiConfig>('api')!;
  }

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

    // REGLA 1: ADMIN global (sin localityId) → Acceso a TODAS las instancias
    if (admin.role === AdminRole.ADMIN && !admin.localityId) {
      return true;
    }

    // REGLA 2: Validar que la instancia tenga LOCALITY_ID configurado
    if (!this.apiConfig.LOCALITY_ID) {
      throw new ForbiddenException(
        'Server misconfiguration: LOCALITY_ID must be set in environment variables',
      );
    }

    // REGLA 3: LOCAL admin sin localityId → ERROR (debe tener localidad asignada)
    if (admin.role === AdminRole.LOCAL && !admin.localityId) {
      throw new ForbiddenException('LOCAL admin must have a locality assigned');
    }

    // REGLA 4: Validar que el localityId del admin coincida con el de la instancia
    if (admin.localityId && admin.localityId !== this.apiConfig.LOCALITY_ID) {
      throw new ForbiddenException(
        `Access denied. This admin belongs to locality ${admin.localityId}, but this instance serves locality ${this.apiConfig.LOCALITY_ID}`,
      );
    }

    return true;
  }
}
