import { Module } from '@nestjs/common';
import { CompanyController } from 'src/controllers/company.controller';
import {
  CompanyCreateService,
  CompanyDeleteService,
  CompanyReadService,
  CompanyUpdateService,
} from 'src/services/company';
import { DatabaseService } from 'src/services/common';

@Module({
  controllers: [CompanyController],
  providers: [
    DatabaseService,
    CompanyCreateService,
    CompanyDeleteService,
    CompanyReadService,
    CompanyUpdateService,
  ],
  exports: [CompanyReadService],
})
export class CompanyModule {}
