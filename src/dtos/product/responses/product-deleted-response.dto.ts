import { GenericResponseDto } from 'src/dtos/common';
import type { ProductDeletedResponse } from 'src/types/product';

export class ProductDeletedResponseDto
  extends GenericResponseDto
  implements ProductDeletedResponse {}
