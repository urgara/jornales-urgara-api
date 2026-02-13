import { Injectable } from '@nestjs/common';
import { DatabaseCommonService, UuidService } from '../common';
import type { CreateAgency, Agency } from 'src/types/agency';

@Injectable()
export class AgencyCreateService {
  constructor(
    private readonly databaseService: DatabaseCommonService,
    private readonly uuidService: UuidService,
  ) {}

  async create(data: CreateAgency): Promise<Agency> {
    return await this.databaseService.agency.create({
      data: {
        id: this.uuidService.V6(),
        name: data.name.toUpperCase(),
      },
    });
  }
}
