import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common';
import type { CreateLocality, Locality } from 'src/types/locality';

@Injectable()
export class LocalityCreateService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: CreateLocality): Promise<Locality> {
    return this.databaseService.locality.create({
      data,
    });
  }
}
