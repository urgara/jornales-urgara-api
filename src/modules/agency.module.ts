import { Module } from '@nestjs/common';
import { AgencyController } from 'src/controllers/agency.controller';
import {
  AgencyCreateService,
  AgencyDeleteService,
  AgencyReadService,
  AgencyUpdateService,
} from 'src/services/agency';

@Module({
  controllers: [AgencyController],
  providers: [
    AgencyCreateService,
    AgencyDeleteService,
    AgencyReadService,
    AgencyUpdateService,
  ],
  exports: [AgencyReadService],
})
export class AgencyModule {}
