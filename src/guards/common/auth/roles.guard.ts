import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type AdminTypeRole } from 'src/types/auth';
import type { ReqAdmin } from '../../../types/auth/request.type';
import { ROLE_KEY } from '../../../decorators/common/auth/access-level.decorator';
import { IS_PUBLIC_KEY } from '../../../decorators/common/auth';
import {
  ForbiddenException,
  UnauthorizedException,
} from 'src/exceptions/common/auth';

@Injectable()
export class RoleGuard implements CanActivate {
  private readonly roleHierarchy: Record<AdminTypeRole, number> = {
    ADMIN: 1,       // Mayor nivel de acceso - acceso total
    LOCAL: 5,       // Administrador local
    ONLY_READ: 10,  // Solo lectura - menor nivel de acceso
  };

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Verificar si la ruta está marcada como pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    // Obtener el rol requerido del decorador @Roles
    const classRole: AdminTypeRole = this.reflector.get<AdminTypeRole>(
      ROLE_KEY,
      context.getClass(),
    );
    const methodRole: AdminTypeRole = this.reflector.get<AdminTypeRole>(
      ROLE_KEY,
      context.getHandler(),
    );

    // El rol del método tiene prioridad sobre el de la clase
    const requiredRole: AdminTypeRole = methodRole || classRole;

    if (!requiredRole) {
      // Si no se especifica rol, la ruta es pública
      return true;
    }

    // Obtener el admin del request (añadido por JwtGuard)
    const request: ReqAdmin = context.switchToHttp().getRequest();
    const { admin } = request;

    // Verificar que el admin existe
    if (!admin) {
      throw new UnauthorizedException('Authentication required');
    }

    // Verificar que el admin tiene rol asignado
    if (!admin.role) {
      throw new ForbiddenException('User role not found');
    }

    // Verificar permisos: menor número = mayor acceso
    const userLevel = this.roleHierarchy[admin.role];
    const requiredLevel = this.roleHierarchy[requiredRole];
    if (userLevel <= requiredLevel) {
      return true;
    } else {
      throw new ForbiddenException(
        `Access denied. Required role: ${requiredRole}, current role: ${admin.role}`,
      );
    }
  }
}
