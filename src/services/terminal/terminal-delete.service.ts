import { Injectable } from '@nestjs/common';
import { DatabaseLocalityService, LocalityResolverService } from '../common';
import { NotFoundException } from 'src/exceptions/common';
import type { TerminalId } from 'src/types/terminal';
import type { Admin } from 'src/types/auth';

@Injectable()
export class TerminalDeleteService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly localityResolver: LocalityResolverService,
  ) {}

  async delete(
    id: TerminalId,
    admin: Pick<Admin, 'role' | 'localityId'>,
    bodyLocalityId: string,
  ): Promise<void> {
    const localityId = this.localityResolver.resolve(admin, bodyLocalityId);
    const db = this.databaseService.getTenantClient(localityId);
    const existingTerminal = await db.terminal.findFirst({
      where: { id },
    });

    if (!existingTerminal) {
      throw new NotFoundException(`Terminal with ID ${id} not found`);
    }

    await db.terminal.delete({
      where: { id },
    });
  }
}
