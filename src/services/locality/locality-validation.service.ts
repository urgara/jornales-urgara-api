import { Injectable } from '@nestjs/common';
import { DatabaseCommonService } from '../common';
import { NotFoundException } from 'src/exceptions/common';
import type { LocalityId } from 'src/types/locality';

@Injectable()
export class LocalityValidationService {
  constructor(private readonly databaseService: DatabaseCommonService) {}

  async validateExists(localityId: LocalityId): Promise<void> {
    const locality = await this.databaseService.locality.findFirst({
      where: {
        id: localityId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!locality) {
      throw new NotFoundException(
        `Locality with ID ${localityId} does not exist`,
      );
    }
  }
}
