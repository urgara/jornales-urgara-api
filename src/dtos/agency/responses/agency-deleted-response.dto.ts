import { GenericResponseDto } from 'src/dtos/common';
import type { AgencyDeletedResponse } from 'src/types/agency';

export class AgencyDeletedResponseDto
  extends GenericResponseDto
  implements AgencyDeletedResponse {}
