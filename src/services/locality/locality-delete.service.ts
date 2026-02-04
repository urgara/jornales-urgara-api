import { Injectable } from '@nestjs/common';
import { DatabaseCommonService } from '../common';
import { NotFoundException } from 'src/exceptions/common';
import type { LocalityId } from 'src/types/locality';

@Injectable()
export class LocalityDeleteService {
  constructor(private readonly databaseService: DatabaseCommonService) {}

  async delete(id: LocalityId): Promise<void> {
    const existingLocality = await this.databaseService.locality.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingLocality) {
      throw new NotFoundException(`Locality with ID ${id} not found`);
    }

    await this.databaseService.locality.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
