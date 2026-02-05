import { Module } from '@nestjs/common';
import { CompanyController } from 'src/controllers/company.controller';
import {
  CompanyCreateService,
  CompanyDeleteService,
  CompanyReadService,
  CompanyUpdateService,
  CompanyValidationService,
} from 'src/services/company';

@Module({
  controllers: [CompanyController],
  providers: [
    CompanyCreateService,
    CompanyDeleteService,
    CompanyReadService,
    CompanyUpdateService,
    CompanyValidationService,
  ],
  exports: [CompanyReadService, CompanyValidationService],
})
export class CompanyModule {}
