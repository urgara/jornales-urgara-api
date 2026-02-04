import { Injectable } from '@nestjs/common';
import { DatabaseCommonService, UuidService } from '../common';
import type { CreateCompany, Company } from 'src/types/company';

@Injectable()
export class CompanyCreateService {
  constructor(
    private readonly databaseService: DatabaseCommonService,
    private readonly uuidService: UuidService,
  ) {}

  async create(data: CreateCompany): Promise<Company> {
    return await this.databaseService.company.create({
      data: {
        id: this.uuidService.V6(),
        name: data.name,
        cuit: data.cuit ?? null,
      },
    });
  }
}
