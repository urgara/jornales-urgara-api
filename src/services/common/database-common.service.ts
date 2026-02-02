import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseException } from '../../exceptions/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../../../generated/prisma-common/client';

@Injectable()
export class DatabaseCommonService
  extends PrismaClient
  implements OnModuleInit
{
  constructor() {
    const connectionString = process.env.DATABASE_COMMON_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch {
      throw new DatabaseException('Initialization Common DB Error');
    }
  }
}
