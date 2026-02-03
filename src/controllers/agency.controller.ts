import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import {
  CreateAgencyDto,
  UpdateAgencyDto,
  AgenciesQueryDto,
} from 'src/dtos/agency/requests';
import {
  AllAgenciesResponseDto,
  ListAgenciesResponseDto,
  AgencyCreatedResponseDto,
  AgencyDeletedResponseDto,
  AgencySingleResponseDto,
  AgencyUpdatedResponseDto,
} from 'src/dtos/agency/responses';
import { AccessLevel } from 'src/decorators/common/auth';
import { AdminRole } from 'src/types/auth';
import {
  AgencyCreateService,
  AgencyDeleteService,
  AgencyReadService,
  AgencyUpdateService,
} from 'src/services/agency';
import type { AgencyId } from 'src/types/agency';

@ApiTags('Agencies')
@Controller('agencies')
@AccessLevel(AdminRole.ADMIN)
export class AgencyController {
  constructor(
    private readonly agencyCreateService: AgencyCreateService,
    private readonly agencyDeleteService: AgencyDeleteService,
    private readonly agencyReadService: AgencyReadService,
    private readonly agencyUpdateService: AgencyUpdateService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all agencies',
    description:
      'Retrieves a paginated and filtered list of agencies with sorting options',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Agencies retrieved successfully',
    type: AllAgenciesResponseDto,
  })
  async findAllAgencies(@Query() query: AgenciesQueryDto) {
    const result = await this.agencyReadService.findAllAgencies(query);
    return plainToInstance(
      AllAgenciesResponseDto,
      {
        success: true,
        message: 'Agencies retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      },
      {
        enableImplicitConversion: true,
      },
    );
  }

  @Get('select')
  @ApiOperation({
    summary: 'Get list of agencies',
    description: 'Get a list of active agencies for select dropdown',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Agencies retrieved successfully',
    type: ListAgenciesResponseDto,
  })
  async findSelect() {
    const result = await this.agencyReadService.selectAgencies();

    return plainToInstance(
      ListAgenciesResponseDto,
      {
        success: true,
        message: 'Agencies retrieved successfully',
        data: result,
      },
      {
        enableImplicitConversion: true,
      },
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create new agency' })
  @ApiBody({ type: CreateAgencyDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Agency created successfully',
    type: AgencyCreatedResponseDto,
  })
  async createAgency(@Body() createAgencyDto: CreateAgencyDto) {
    const agency = await this.agencyCreateService.create(createAgencyDto);

    return plainToInstance(
      AgencyCreatedResponseDto,
      {
        success: true,
        message: 'Agency created successfully',
        data: agency,
      },
      {
        enableImplicitConversion: true,
      },
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get agency by ID' })
  @ApiParam({ name: 'id', description: 'Agency ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Agency retrieved successfully',
    type: AgencySingleResponseDto,
  })
  async getAgencyById(@Param('id', ParseUUIDPipe) id: AgencyId) {
    const agency = await this.agencyReadService.findById(id);

    return plainToInstance(
      AgencySingleResponseDto,
      {
        success: true,
        message: 'Agency retrieved successfully',
        data: agency,
      },
      {
        enableImplicitConversion: true,
      },
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update agency by ID' })
  @ApiParam({ name: 'id', description: 'Agency ID (UUID)' })
  @ApiBody({ type: UpdateAgencyDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Agency updated successfully',
    type: AgencyUpdatedResponseDto,
  })
  async updateAgency(
    @Param('id', ParseUUIDPipe) id: AgencyId,
    @Body() updateAgencyDto: UpdateAgencyDto,
  ) {
    const agency = await this.agencyUpdateService.update(id, updateAgencyDto);

    return plainToInstance(
      AgencyUpdatedResponseDto,
      {
        success: true,
        message: 'Agency updated successfully',
        data: agency,
      },
      {
        enableImplicitConversion: true,
      },
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete agency by ID' })
  @ApiParam({ name: 'id', description: 'Agency ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Agency deleted successfully',
    type: AgencyDeletedResponseDto,
  })
  async deleteAgency(@Param('id', ParseUUIDPipe) id: AgencyId) {
    await this.agencyDeleteService.delete(id);

    return plainToInstance(
      AgencyDeletedResponseDto,
      {
        success: true,
        message: 'Agency deleted successfully',
      },
      {
        enableImplicitConversion: true,
      },
    );
  }
}
