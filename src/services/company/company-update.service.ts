import { Injectable } from '@nestjs/common';
import { DatabaseCommonService } from '../common';
import { NotFoundException } from 'src/exceptions/common';
import type { CompanyId, UpdateCompany, Company } from 'src/types/company';

@Injectable()
export class CompanyUpdateService {
  constructor(private readonly databaseService: DatabaseCommonService) {}

  async update(id: CompanyId, data: UpdateCompany): Promise<Company> {
    const company = await this.databaseService.company.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return await this.databaseService.company.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name.toUpperCase() }),
        ...(data.cuit !== undefined && { cuit: data.cuit ?? null }),
      },
    });
  }
}
