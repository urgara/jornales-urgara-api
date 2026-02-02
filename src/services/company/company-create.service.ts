import { Injectable } from '@nestjs/common';
import { DatabaseCommonService } from '../common';
import type { CreateCompany, Company } from 'src/types/company';

@Injectable()
export class CompanyCreateService {
  constructor(private readonly databaseService: DatabaseCommonService) {}

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
