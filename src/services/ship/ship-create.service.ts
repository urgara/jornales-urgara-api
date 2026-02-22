import { Injectable } from '@nestjs/common';
import { DatabaseCommonService, UuidService } from '../common';
import type { CreateShip, Ship } from 'src/types/ship';

@Injectable()
export class ShipCreateService {
  constructor(
    private readonly databaseService: DatabaseCommonService,
    private readonly uuidService: UuidService,
  ) {}

  async create(data: CreateShip): Promise<Ship> {
    return await this.databaseService.ship.create({
      data: {
        id: this.uuidService.V6(),
        name: data.name.toUpperCase(),
      },
    });
  }
}
