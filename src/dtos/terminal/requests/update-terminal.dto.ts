import { PartialType } from '@nestjs/swagger';
import { CreateTerminalDto } from './create-terminal.dto';
import type { UpdateTerminal } from 'src/types/terminal';

export class UpdateTerminalDto
  extends PartialType(CreateTerminalDto)
  implements UpdateTerminal {}
