import { Injectable } from '@nestjs/common';
import { DatabaseLocalityService } from '../common';
import { NotFoundException } from 'src/exceptions/common';
import type { TerminalId } from 'src/types/terminal';

@Injectable()
export class TerminalDeleteService {
  constructor(private readonly databaseService: DatabaseLocalityService) {}

  async delete(id: TerminalId): Promise<void> {
    const existingTerminal = await this.databaseService.terminal.findFirst({
      where: { id },
    });

    if (!existingTerminal) {
      throw new NotFoundException(`Terminal with ID ${id} not found`);
    }

    await this.databaseService.terminal.delete({
      where: { id },
    });
  }
}
