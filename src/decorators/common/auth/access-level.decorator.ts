import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import type { AdminTypeRole } from 'src/types/auth';

export const ROLE_KEY = 'Role'; // Clave para los metadatos

/**
 * AccessLevel - Decorador que define el nivel de acceso requerido para una ruta
 *
 * @param role - Rol mínimo requerido para acceder (ADMIN o LOCAL)
 *
 * IMPORTANTE:
 * - Los guards (JwtGuard, LocalityGuard, RoleGuard) están configurados como GLOBALES
 *   en app.module.ts y se ejecutan automáticamente en TODAS las rutas.
 * - Este decorador solo establece el rol requerido mediante metadata.
 * - RoleGuard lee esta metadata para determinar si el usuario tiene suficientes permisos.
 * - Para rutas públicas (sin autenticación), usar @Public() en lugar de este decorador.
 *
 * Orden de ejecución automática (configurado en app.module.ts):
 * 1. JwtGuard - Valida JWT y autenticación
 * 2. LocalityGuard - Valida acceso por localidad
 * 3. RoleGuard - Valida permisos (lee ROLE_KEY de este decorador)
 */
export const AccessLevel = (role: AdminTypeRole) => {
  return applyDecorators(
    ApiBearerAuth(),
    SetMetadata(ROLE_KEY, role), // Solo metadata, guards ya son globales
  );
};
