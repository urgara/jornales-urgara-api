import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsJSON, ValidateNested } from 'class-validator';
import { GenericDataResponseDto } from 'src/dtos/common';
import { WorkShiftConfigResponse } from 'src/types/work-shift';
import type { Json } from 'src/types/common';

export class WorkShiftConfigDataDto {
  @ApiProperty({
    description: 'Work shift configuration ID (Port ID)',
    example: 1,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Work shift configuration in JSON format',
    example: {
      types: ['STANDART', 'JC'],
      list: [
        {
          name: '07 A 13 (LUN A SAB)',
          remuneratedCoefficient: 1.5,
          notRemuneratedCoefficient: 1.2,
        },
        {
          name: '13 A 19 (LUN A VIE)',
          remuneratedCoefficient: 2.0,
          notRemuneratedCoefficient: 1.8,
        },
      ],
    },
  })
  @IsJSON()
  config: Json;
}

export class WorkShiftConfigResponseDto
  extends GenericDataResponseDto<WorkShiftConfigDataDto>
  implements WorkShiftConfigResponse
{
  @ApiProperty({
    description: 'Work shift configuration data',
    type: WorkShiftConfigDataDto,
  })
  @ValidateNested()
  @Type(() => WorkShiftConfigDataDto)
  declare data: WorkShiftConfigDataDto;
}
