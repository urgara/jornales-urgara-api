import {
  Controller,
  Post,
  Delete,
  Body,
  HttpStatus,
  UseGuards,
  Get,
  Query,
  Param,
  Req,
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
  CreateWorkShiftBaseValueDto,
  DeleteWorkShiftBaseValueDto,
  WorkShiftBaseValuesQueryDto,
  WorkShiftBaseValueSelectQueryDto,
} from 'src/dtos/work-shift-base-value/requests';
import {
  AllWorkShiftBaseValuesResponseDto,
  WorkShiftBaseValueCreatedResponseDto,
  WorkShiftBaseValueDeletedResponseDto,
  WorkShiftBaseValueSelectResponseDto,
  WorkShiftBaseValueSingleResponseDto,
} from 'src/dtos/work-shift-base-value/responses';
import { AccessLevel } from 'src/decorators/common/auth';
import { JwtGuard } from 'src/guards/common/auth';
import { AdminRole, type ReqAdmin } from 'src/types/auth';
import {
  CreateWorkShiftBaseValueService,
  DeleteWorkShiftBaseValueService,
  ReadWorkShiftBaseValueService,
} from 'src/services/work-shift-base-value';
import type { WorkShiftBaseValueId } from '../types/work-shift-base-value';

@ApiTags('Work Shift Base Values')
@Controller('work-shift-base-values')
@UseGuards(JwtGuard)
export class WorkShiftBaseValueController {
  constructor(
    private readonly createService: CreateWorkShiftBaseValueService,
    private readonly readService: ReadWorkShiftBaseValueService,
    private readonly deleteService: DeleteWorkShiftBaseValueService,
  ) {}

  @Get()
  @AccessLevel(AdminRole.ONLY_READ)
  @ApiOperation({
    summary: 'Get all work shift base values',
    description:
      'Retrieves a paginated list of work shift base values with their calculated values',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Work shift base values retrieved successfully',
    type: AllWorkShiftBaseValuesResponseDto,
  })
  async findAll(
    @Query() query: WorkShiftBaseValuesQueryDto,
    @Req() request: ReqAdmin,
  ) {
    const result = await this.readService.findAll(request.admin, query);
    return plainToInstance(
      AllWorkShiftBaseValuesResponseDto,
      {
        success: true,
        message: 'Work shift base values retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      },
      { enableImplicitConversion: true },
    );
  }

  @Get('select')
  @AccessLevel(AdminRole.ONLY_READ)
  @ApiOperation({
    summary: 'Get work shift base values for select',
    description:
      'Retrieves work shift base values where the given date falls within startDate-endDate range, filtered by category',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Work shift base values for select retrieved successfully',
    type: WorkShiftBaseValueSelectResponseDto,
  })
  async findForSelect(
    @Query() query: WorkShiftBaseValueSelectQueryDto,
    @Req() request: ReqAdmin,
  ) {
    const baseValues = await this.readService.findForSelect(
      request.admin,
      query,
    );

    return plainToInstance(
      WorkShiftBaseValueSelectResponseDto,
      {
        success: true,
        message: 'Work shift base values for select retrieved successfully',
        data: baseValues,
      },
      { enableImplicitConversion: true },
    );
  }

  @Get(':id')
  @AccessLevel(AdminRole.ONLY_READ)
  @ApiOperation({ summary: 'Get work shift base value by ID' })
  @ApiParam({ name: 'id', description: 'Work shift base value ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Work shift base value retrieved successfully',
    type: WorkShiftBaseValueSingleResponseDto,
  })
  async findById(
    @Param('id') id: WorkShiftBaseValueId,
    @Query() query: WorkShiftBaseValuesQueryDto,
    @Req() request: ReqAdmin,
  ) {
    const baseValue = await this.readService.findById(
      id,
      request.admin,
      query.localityId,
    );

    return plainToInstance(
      WorkShiftBaseValueSingleResponseDto,
      {
        success: true,
        message: 'Work shift base value retrieved successfully',
        data: baseValue,
      },
      { enableImplicitConversion: true },
    );
  }

  @Delete(':id')
  @AccessLevel(AdminRole.LOCAL)
  @ApiOperation({ summary: 'Delete work shift base value by ID' })
  @ApiParam({ name: 'id', description: 'Work shift base value ID (UUID)' })
  @ApiBody({ type: DeleteWorkShiftBaseValueDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Work shift base value deleted successfully',
    type: WorkShiftBaseValueDeletedResponseDto,
  })
  async delete(
    @Param('id') id: WorkShiftBaseValueId,
    @Body() dto: DeleteWorkShiftBaseValueDto,
    @Req() request: ReqAdmin,
  ) {
    await this.deleteService.delete(id, request.admin, dto.localityId);

    return plainToInstance(
      WorkShiftBaseValueDeletedResponseDto,
      {
        success: true,
        message: 'Work shift base value deleted successfully',
      },
      { enableImplicitConversion: true },
    );
  }

  @Post()
  @AccessLevel(AdminRole.LOCAL)
  @ApiOperation({
    summary: 'Create new work shift base value with calculated values',
  })
  @ApiBody({ type: CreateWorkShiftBaseValueDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Work shift base value created successfully',
    type: WorkShiftBaseValueCreatedResponseDto,
  })
  async create(
    @Body() dto: CreateWorkShiftBaseValueDto,
    @Req() request: ReqAdmin,
  ) {
    const baseValue = await this.createService.create(request.admin, dto);

    return plainToInstance(
      WorkShiftBaseValueCreatedResponseDto,
      {
        success: true,
        message: 'Work shift base value created successfully',
        data: baseValue,
      },
      { enableImplicitConversion: true },
    );
  }
}
