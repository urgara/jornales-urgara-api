import { Injectable } from '@nestjs/common';
import {
  DatabaseLocalityService,
  UuidService,
  LocalityResolverService,
} from '../common';
import type { CreateTerminal, Terminal } from 'src/types/terminal';
import type { LocalityOperationContext } from 'src/types/locality';
import type { Admin } from 'src/types/auth';

@Injectable()
export class TerminalCreateService {
  constructor(
    private readonly databaseService: DatabaseLocalityService,
    private readonly uuidService: UuidService,
    private readonly localityResolver: LocalityResolverService,
  ) {}

  async create(
    admin: Pick<Admin, 'role' | 'localityId'>,
    data: CreateTerminal & LocalityOperationContext,
  ): Promise<Terminal> {
    const localityId = this.localityResolver.resolve(admin, data.localityId);
    const db = this.databaseService.getTenantClient(localityId);
    return await db.terminal.create({
      data: {
        id: this.uuidService.V6(),
        name: data.name,
      },
    });
  }
}
