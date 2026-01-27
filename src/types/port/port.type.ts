import type { Port as PrismaPort } from '../../../generated/prisma/client';
import type { PaginationRequest, Sorting } from '../common';

type Port = PrismaPort;
type PortId = Port['id'];
type CreatePort = Omit<Port, 'id' | 'createdAt' | 'deletedAt'>;
type UpdatePort = Partial<CreatePort>;

type PortSortBy = keyof Port;

interface FindPortQuery
  extends Sorting<PortSortBy>,
    PaginationRequest,
    Partial<Pick<Port, 'name' | 'createdAt' | 'deletedAt'>> {}

export type { Port, PortId, CreatePort, UpdatePort, PortSortBy, FindPortQuery };
