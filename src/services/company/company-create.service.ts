import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common';
import type { CreateCompany, Company } from 'src/types/company';

@Injectable()
export class CompanyCreateService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: CreateCompany): Promise<Company> {
    return await this.databaseService.company.create({
      data: {
        name: data.name,
        cuit: data.cuit ?? null,
        legalEntityId: data.legalEntityId,
      },
    });
  }
}
