import { PartialType } from '@nestjs/swagger';
import { CreateCompanyDto } from './create-company.dto';
import type { UpdateCompany } from 'src/types/company';

export class UpdateCompanyDto
  extends PartialType(CreateCompanyDto)
  implements UpdateCompany {}
