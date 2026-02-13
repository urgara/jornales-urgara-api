import { Injectable } from '@nestjs/common';
import { DatabaseCommonService } from '../common';
import { NotFoundException } from 'src/exceptions/common';
import type { AgencyId, UpdateAgency, Agency } from 'src/types/agency';

@Injectable()
export class AgencyUpdateService {
  constructor(private readonly databaseService: DatabaseCommonService) {}

  async update(id: AgencyId, data: UpdateAgency): Promise<Agency> {
    const agency = await this.databaseService.agency.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!agency) {
      throw new NotFoundException(`Agency with ID ${id} not found`);
    }

    return await this.databaseService.agency.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name.toUpperCase() }),
      },
    });
  }
}
