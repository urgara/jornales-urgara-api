import { PartialType } from '@nestjs/swagger';
import { CreateShipDto } from './create-ship.dto';
import type { UpdateShip } from 'src/types/ship';

export class UpdateShipDto extends PartialType(CreateShipDto) implements UpdateShip {}
