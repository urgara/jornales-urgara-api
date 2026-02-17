import { Module } from '@nestjs/common';
import { ShipController } from 'src/controllers/ship.controller';
import {
  ShipCreateService,
  ShipDeleteService,
  ShipReadService,
  ShipUpdateService,
} from 'src/services/ship';

@Module({
  controllers: [ShipController],
  providers: [
    ShipCreateService,
    ShipDeleteService,
    ShipReadService,
    ShipUpdateService,
  ],
  exports: [ShipReadService],
})
export class ShipModule {}
