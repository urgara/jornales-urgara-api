import { GenericResponseDto } from 'src/dtos/common';
import type { TerminalDeletedResponse } from 'src/types/terminal';

export class TerminalDeletedResponseDto
  extends GenericResponseDto
  implements TerminalDeletedResponse {}
