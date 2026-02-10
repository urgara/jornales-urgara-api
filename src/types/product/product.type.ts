import type { Product as PrismaProduct } from '../../../generated/prisma-common';

type Product = PrismaProduct;
type ProductId = Product['id'];

type CreateProduct = Omit<
  Product,
  'id' | 'createdAt' | 'deletedAt' | 'isActive'
>;
type UpdateProduct = Partial<CreateProduct> & {
  isActive?: boolean; // Solo se puede cambiar en update
};

interface FindProductsQuery {
  page?: number;
  limit?: number;
  sortBy?: ProductSortBy;
  sortOrder?: 'asc' | 'desc';
  name?: string;
  isActive?: boolean;
}

type ProductSortBy = 'id' | 'name';

// Response types
interface ProductCreatedResponse {
  success: boolean;
  message: string;
  data: Product;
}

interface ProductUpdatedResponse {
  success: boolean;
  message: string;
  data: Product;
}

interface ProductDeletedResponse {
  success: boolean;
  message: string;
}

interface ProductSingleResponse {
  success: boolean;
  message: string;
  data: Product;
}

interface AllProductsResponse {
  success: boolean;
  message: string;
  data: Array<Product>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ListProductsResponse {
  success: boolean;
  message: string;
  data: Array<{
    id: string;
    name: string;
  }>;
}

export type {
  Product,
  ProductId,
  CreateProduct,
  UpdateProduct,
  FindProductsQuery,
  ProductSortBy,
  ProductCreatedResponse,
  ProductUpdatedResponse,
  ProductDeletedResponse,
  ProductSingleResponse,
  AllProductsResponse,
  ListProductsResponse,
};
