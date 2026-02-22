import type { Ship as PrismaShip } from '../../../generated/prisma-common';
import type { NullToUndefined } from '../common';

type Ship = PrismaShip;
type ShipId = Ship['id'];

type CreateShip = NullToUndefined<Omit<Ship, 'id' | 'createdAt' | 'deletedAt'>>;
type UpdateShip = Partial<CreateShip>;

interface FindShipsQuery {
  page?: number;
  limit?: number;
  sortBy?: ShipSortBy;
  sortOrder?: 'asc' | 'desc';
  name?: string;
}

type ShipSortBy = 'id' | 'name' | 'createdAt';

// Response types
interface ShipCreatedResponse {
  success: boolean;
  message: string;
  data: Ship;
}

interface ShipUpdatedResponse {
  success: boolean;
  message: string;
  data: Ship;
}

interface ShipDeletedResponse {
  success: boolean;
  message: string;
}

interface ShipSingleResponse {
  success: boolean;
  message: string;
  data: Ship;
}

interface AllShipsResponse {
  success: boolean;
  message: string;
  data: Ship[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ListShipsResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: string;
    name: string;
  }>;
}

export type {
  Ship,
  ShipId,
  CreateShip,
  UpdateShip,
  FindShipsQuery,
  ShipSortBy,
  ShipCreatedResponse,
  ShipUpdatedResponse,
  ShipDeletedResponse,
  ShipSingleResponse,
  AllShipsResponse,
  ListShipsResponse,
};
