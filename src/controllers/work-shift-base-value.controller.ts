import {
  Controller,
  Post,
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
  WorkShiftBaseValuesQueryDto,
} from 'src/dtos/work-shift-base-value/requests';
import {
  AllWorkShiftBaseValuesResponseDto,
  WorkShiftBaseValueCreatedResponseDto,
  WorkShiftBaseValueSingleResponseDto,
} from 'src/dtos/work-shift-base-value/responses';
import { AccessLevel } from 'src/decorators/common/auth';
import { JwtGuard } from 'src/guards/common/auth';
import { AdminRole, type ReqAdmin } from 'src/types/auth';
import {
  CreateWorkShiftBaseValueService,
  ReadWorkShiftBaseValueService,
} from 'src/services/work-shift-base-value';
import type { WorkShiftBaseValueId } from '../types/work-shift-base-value';

@ApiTags('Work Shift Base Values')
@Controller('work-shift-base-values')
@UseGuards(JwtGuard)
@AccessLevel(AdminRole.ADMIN)
export class WorkShiftBaseValueController {
  constructor(
    private readonly createService: CreateWorkShiftBaseValueService,
    private readonly readService: ReadWorkShiftBaseValueService,
  ) {}

  @Get()
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

  @Get(':id')
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

  @Post()
  @ApiOperation({ summary: 'Create new work shift base value with calculated values' })
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
