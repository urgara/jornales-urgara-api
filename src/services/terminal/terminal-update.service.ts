import { Injectable } from '@nestjs/common';
import { DatabaseLocalityService, LocalityResolverService } from '../common';
import { NotFoundException } from 'src/exceptions/common';
import type { TerminalId, UpdateTerminal, Terminal } from 'src/types/terminal';
import type { LocalityOperationContext } from 'src/types/locality';
import type { Admin } from 'src/types/auth';

@Injectable()
export class TerminalUpdateService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly localityResolver: LocalityResolverService,
  ) {}

  async update(
    id: TerminalId,
    admin: Pick<Admin, 'role' | 'localityId'>,
    data: UpdateTerminal & Partial<LocalityOperationContext>,
  ): Promise<Terminal> {
    const localityId = this.localityResolver.resolve(admin, data.localityId);
    const db = this.databaseService.getTenantClient(localityId);
    const existingTerminal = await db.terminal.findFirst({
      where: { id },
    });

    if (!existingTerminal) {
      throw new NotFoundException(`Terminal with ID ${id} not found`);
    }

    return await db.terminal.update({
      where: { id },
      data,
    });
  }
}
