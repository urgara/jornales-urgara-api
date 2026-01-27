import { GenericResponseDto } from 'src/dtos/common';
import type { CompanyDeletedResponse } from 'src/types/company';

export class CompanyDeletedResponseDto
  extends GenericResponseDto
  implements CompanyDeletedResponse {}
