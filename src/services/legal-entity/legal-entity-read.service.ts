import { Injectable } from '@nestjs/common';
import { DatabaseCommonService } from '../common';

@Injectable()
export class LegalEntityReadService {
  constructor(private readonly databaseService: DatabaseCommonService) {}

  async selectLegalEntities() {
    return await this.databaseService.legalEntity.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        abbreviation: true,
        description: true,
      },
      orderBy: {
        description: 'asc',
      },
    });
  }
}
