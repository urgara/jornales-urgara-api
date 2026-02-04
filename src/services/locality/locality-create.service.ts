import { Injectable } from '@nestjs/common';
import { DatabaseCommonService, UuidService } from '../common';
import type { CreateLocality, Locality } from 'src/types/locality';

@Injectable()
export class LocalityCreateService {
  constructor(
    private readonly databaseService: DatabaseCommonService,
    private readonly uuidService: UuidService,
  ) {}

  async create(data: CreateLocality): Promise<Locality> {
    return this.databaseService.locality.create({
      data: {
        id: this.uuidService.V6(),
        ...data,
      },
    });
  }
}
