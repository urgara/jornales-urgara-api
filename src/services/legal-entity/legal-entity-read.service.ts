import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common';

@Injectable()
export class LegalEntityReadService {
  constructor(private readonly databaseService: DatabaseService) {}

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
