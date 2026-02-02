import { Injectable } from '@nestjs/common';
import { DatabaseCommonService } from '../common';
import type { CreateLocality, Locality } from 'src/types/locality';

@Injectable()
export class LocalityCreateService {
  constructor(private readonly databaseService: DatabaseCommonService) {}

  async create(data: CreateLocality): Promise<Locality> {
    return this.databaseService.locality.create({
      data,
    });
  }
}
