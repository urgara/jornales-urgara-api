import { Injectable } from '@nestjs/common';
import { DatabaseCommonService } from '../common';
import { NotFoundException } from 'src/exceptions/common';
import type { ShipId } from 'src/types/ship';

@Injectable()
export class ShipDeleteService {
  constructor(private readonly databaseService: DatabaseCommonService) {}

  async delete(id: ShipId): Promise<void> {
    const ship = await this.databaseService.ship.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!ship) {
      throw new NotFoundException(`Ship with ID ${id} not found`);
    }

    await this.databaseService.ship.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
