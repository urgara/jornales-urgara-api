import { PartialType } from '@nestjs/swagger';
import { CreateAgencyDto } from './create-agency.dto';
import type { UpdateAgency } from 'src/types/agency';

export class UpdateAgencyDto
  extends PartialType(CreateAgencyDto)
  implements UpdateAgency {}
