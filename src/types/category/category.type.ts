import type { Category as PrismaCategory } from '../../../generated/prisma/client';
import type { PaginationRequest, Sorting } from '../common';

type Category = PrismaCategory;
type CategoryId = Category['id'];
type CreateCategory = Omit<Category, 'id' | 'createdAt' | 'deletedAt'>;
type UpdateCategory = Partial<CreateCategory>;

type CategorySortBy = keyof Category;

interface FindCategoryQuery
  extends Sorting<CategorySortBy>,
    PaginationRequest,
    Partial<Pick<Category, 'name' | 'isSpecial' | 'createdAt' | 'deletedAt'>> {}

export type {
  Category,
  CategoryId,
  CreateCategory,
  UpdateCategory,
  CategorySortBy,
  FindCategoryQuery,
};
