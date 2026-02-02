import { Injectable, OnModuleInit } from '@nestjs/common';
import { DatabaseException } from '../../exceptions/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../../../generated/prisma-locality';

@Injectable()
export class DatabaseLocalityService
  extends PrismaClient
  implements OnModuleInit
{
  constructor() {
    const connectionString = process.env.DATABASE_LOCALITY_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch {
      throw new DatabaseException('Initialization Locality DB Error');
    }
  }
}
