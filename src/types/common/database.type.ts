import { PrismaClient } from '../../../generated/prisma-common';

type Transaction = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;
export type { Transaction };
