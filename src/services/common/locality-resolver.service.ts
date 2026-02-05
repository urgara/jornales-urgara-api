import { Injectable } from '@nestjs/common';
import { BadRequestException } from 'src/exceptions/common';
import { AdminRole } from 'src/types/auth';
import type { Admin } from 'src/types/auth';

@Injectable()
export class LocalityResolverService {
  /**
   * Resuelve el localityId basado en el rol del admin y query params
   * - ADMIN: debe proporcionar localityId en query, puede acceder a cualquier localidad
   * - LOCAL: usa su propia localityId, no puede acceder a otras localidades
   */
  resolve(
    admin: Pick<Admin, 'role' | 'localityId'>,
    queryLocalityId?: string,
  ): string {
    if (admin.role === AdminRole.ADMIN) {
      // ADMIN debe especificar localityId en query params
      if (!queryLocalityId) {
        throw new BadRequestException(
          'ADMIN must specify localityId parameter',
        );
      }
      return queryLocalityId;
    } else {
      // LOCAL usa su propia localityId
      if (!admin.localityId) {
        throw new BadRequestException(
          'LOCAL admin must have localityId assigned',
        );
      }
      return admin.localityId;
    }
  }
}
