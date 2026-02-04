import { Injectable } from '@nestjs/common';
import { DatabaseLocalityService } from '../common';
import { NotFoundException } from 'src/exceptions/common';
import type { TerminalId, UpdateTerminal, Terminal } from 'src/types/terminal';

@Injectable()
export class TerminalUpdateService {
  constructor(private readonly databaseService: DatabaseLocalityService) {}

  async update(id: TerminalId, data: UpdateTerminal): Promise<Terminal> {
    const existingTerminal = await this.databaseService.terminal.findFirst({
      where: { id },
    });

    if (!existingTerminal) {
      throw new NotFoundException(`Terminal with ID ${id} not found`);
    }

    return await this.databaseService.terminal.update({
      where: { id },
      data,
    });
  }
}
