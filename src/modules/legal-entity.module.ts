import { Module } from '@nestjs/common';
import { LegalEntityController } from 'src/controllers/legal-entity.controller';
import { LegalEntityReadService } from 'src/services/legal-entity';
import { DatabaseService } from 'src/services/common';

@Module({
  controllers: [LegalEntityController],
  providers: [DatabaseService, LegalEntityReadService],
  exports: [LegalEntityReadService],
})
export class LegalEntityModule {}
