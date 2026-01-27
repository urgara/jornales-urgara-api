import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common';
import { NotFoundException } from 'src/exceptions/common';

@Injectable()
export class LocalityDeleteService {
  constructor(private readonly databaseService: DatabaseService) {}

  async delete(id: number): Promise<void> {
    const existingLocality = await this.databaseService.locality.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingLocality) {
      throw new NotFoundException(`Locality with ID ${id} not found`);
    }

    await this.databaseService.locality.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
