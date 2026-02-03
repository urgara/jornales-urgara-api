import { Injectable } from '@nestjs/common';
import { DatabaseCommonService } from '../common';
import { NotFoundException } from 'src/exceptions/common';
import type { CompanyId } from 'src/types/company';

@Injectable()
export class CompanyValidationService {
  constructor(private readonly databaseService: DatabaseCommonService) {}

  async validateExists(companyId: CompanyId): Promise<void> {
    const company = await this.databaseService.company.findFirst({
      where: {
        id: companyId,
        deletedAt: null,
      },
      select: { id: true },
    });

    if (!company) {
      throw new NotFoundException(
        `Company with ID ${companyId} does not exist`,
      );
    }
  }
}
