import { Module } from '@nestjs/common';
import { LocalityController } from '../controllers/locality.controller';
import {
  LocalityCreateService,
  LocalityReadService,
  LocalityUpdateService,
  LocalityDeleteService,
} from '../services/locality';

@Module({
  controllers: [LocalityController],
  providers: [
    LocalityCreateService,
    LocalityReadService,
    LocalityUpdateService,
    LocalityDeleteService,
  ],
})
export class LocalityModule {}
