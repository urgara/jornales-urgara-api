import type { Terminal as PrismaTerminal } from '../../../generated/prisma-locality';
import type { NullToUndefined } from '../common';

type Terminal = PrismaTerminal;
type TerminalId = Terminal['id'];

type CreateTerminal = NullToUndefined<Omit<Terminal, 'id'>>;
type UpdateTerminal = Partial<CreateTerminal>;

interface FindTerminalsQuery {
  page?: number;
  limit?: number;
  sortBy?: TerminalSortBy;
  sortOrder?: 'asc' | 'desc';
  name?: string;
}

type TerminalSortBy = 'id' | 'name';

// Response types
interface TerminalCreatedResponse {
  success: boolean;
  message: string;
  data: Terminal;
}

interface TerminalUpdatedResponse {
  success: boolean;
  message: string;
  data: Terminal;
}

interface TerminalDeletedResponse {
  success: boolean;
  message: string;
}

interface TerminalSingleResponse {
  success: boolean;
  message: string;
  data: Terminal;
}

interface AllTerminalsResponse {
  success: boolean;
  message: string;
  data: Terminal[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ListTerminalsResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: string;
    name: string;
  }>;
}

export type {
  Terminal,
  TerminalId,
  CreateTerminal,
  UpdateTerminal,
  FindTerminalsQuery,
  TerminalSortBy,
  TerminalCreatedResponse,
  TerminalUpdatedResponse,
  TerminalDeletedResponse,
  TerminalSingleResponse,
  AllTerminalsResponse,
  ListTerminalsResponse,
};
