import { Injectable } from '@nestjs/common';
import { DatabaseCommonService } from '../common';
import { NotFoundException } from 'src/exceptions/common';
import type { AgencyId } from 'src/types/agency';

@Injectable()
export class AgencyDeleteService {
  constructor(private readonly databaseService: DatabaseCommonService) {}

  async delete(id: AgencyId): Promise<void> {
    const agency = await this.databaseService.agency.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!agency) {
      throw new NotFoundException(`Agency with ID ${id} not found`);
    }

    await this.databaseService.agency.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
