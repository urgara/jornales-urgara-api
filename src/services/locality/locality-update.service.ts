import { Injectable } from '@nestjs/common';
import { DatabaseCommonService } from '../common';
import type { UpdateLocality, Locality, LocalityId } from 'src/types/locality';
import { NotFoundException } from 'src/exceptions/common';

@Injectable()
export class LocalityUpdateService {
  constructor(private readonly databaseService: DatabaseCommonService) {}

  async update(id: LocalityId, data: UpdateLocality): Promise<Locality> {
    const existingLocality = await this.databaseService.locality.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingLocality) {
      throw new NotFoundException(`Locality with ID ${id} not found`);
    }

    return this.databaseService.locality.update({
      where: { id },
      data,
    });
  }
}
