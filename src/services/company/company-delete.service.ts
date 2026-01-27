import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common';
import { NotFoundException } from 'src/exceptions/common';
import type { CompanyId } from 'src/types/company';

@Injectable()
export class CompanyDeleteService {
  constructor(private readonly databaseService: DatabaseService) {}

  async delete(id: CompanyId): Promise<void> {
    const company = await this.databaseService.company.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    await this.databaseService.company.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
