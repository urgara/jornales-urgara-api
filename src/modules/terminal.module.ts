import { Module } from '@nestjs/common';
import { TerminalController } from '../controllers/terminal.controller';
import {
  TerminalCreateService,
  TerminalDeleteService,
  TerminalReadService,
  TerminalUpdateService,
} from '../services/terminal';
import { DatabaseLocalityService, UuidService } from '../services/common';

@Module({
  controllers: [TerminalController],
  providers: [
    TerminalCreateService,
    TerminalDeleteService,
    TerminalReadService,
    TerminalUpdateService,
    DatabaseLocalityService,
    UuidService,
  ],
})
export class TerminalModule {}
