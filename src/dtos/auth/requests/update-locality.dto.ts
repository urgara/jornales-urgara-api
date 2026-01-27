import { PartialType } from '@nestjs/swagger';
import type { UpdateLocality } from 'src/types/locality';
import { CreateLocalityDto } from './create-locality.dto';

export class UpdateLocalityDto
  extends PartialType(CreateLocalityDto)
  implements UpdateLocality {}
