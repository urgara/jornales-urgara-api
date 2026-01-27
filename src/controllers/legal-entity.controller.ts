import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { AccessLevel } from 'src/decorators/common/auth';
import { ListLegalEntitiesResponseDto } from 'src/dtos/legal-entity/responses';
import { LegalEntityReadService } from 'src/services/legal-entity';
import { AdminRole } from 'src/types/auth';
import { JwtGuard } from 'src/guards/common/auth';

@ApiTags('Legal Entities')
@Controller('legal-entities')
@UseGuards(JwtGuard)
@AccessLevel(AdminRole.ADMIN)
export class LegalEntityController {
  constructor(
    private readonly legalEntityReadService: LegalEntityReadService,
  ) {}

  @Get('select')
  @ApiOperation({
    summary: 'Get list of legal entities',
    description: 'Get a list of active legal entities for select dropdown',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Legal entities retrieved successfully',
    type: ListLegalEntitiesResponseDto,
  })
  async findSelect() {
    const legalEntities =
      await this.legalEntityReadService.selectLegalEntities();

    return plainToInstance(
      ListLegalEntitiesResponseDto,
      {
        success: true,
        message: 'Legal entities retrieved successfully',
        data: legalEntities,
      },
      {
        enableImplicitConversion: true,
      },
    );
  }
}
