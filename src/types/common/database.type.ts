import { PrismaClient } from '../../../generated/prisma/client';

type Transaction = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;
export type { Transaction };
