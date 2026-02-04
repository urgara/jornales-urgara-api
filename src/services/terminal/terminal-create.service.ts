import { Injectable } from '@nestjs/common';
import { DatabaseLocalityService, UuidService } from '../common';
import type { CreateTerminal, Terminal } from 'src/types/terminal';

@Injectable()
export class TerminalCreateService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly uuidService: UuidService,
  ) {}

  async create(data: CreateTerminal): Promise<Terminal> {
    return await this.databaseService.terminal.create({
      data: {
        id: this.uuidService.V6(),
        name: data.name,
      },
    });
  }
}
