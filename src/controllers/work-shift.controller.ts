import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  Get,
  Query,
  Patch,
  Delete,
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
  CreateWorkShiftDto,
  UpdateWorkShiftDto,
  DeleteWorkShiftDto,
  WorkShiftsQueryDto,
} from 'src/dtos/work-shift/requests';
import {
  AllWorkShiftsResponseDto,
  ListWorkShiftsResponseDto,
  WorkShiftCreatedResponseDto,
  WorkShiftDeletedResponseDto,
  WorkShiftSingleResponseDto,
  WorkShiftUpdatedResponseDto,
} from 'src/dtos/work-shift/responses';
import { AccessLevel } from 'src/decorators/common/auth';
import { JwtGuard } from 'src/guards/common/auth';
import { AdminRole, type ReqAdmin } from 'src/types/auth';
import {
  CreateWorkShiftService,
  DeleteWorkShiftService,
  ReadWorkShiftsService,
  UpdateWorkShiftService,
} from 'src/services/work-shift';
import type { WorkShiftId } from '../types/work-shift';

@ApiTags('Work Shifts')
@Controller('work-shifts')
@UseGuards(JwtGuard)
@AccessLevel(AdminRole.ADMIN)
export class WorkShiftController {
  constructor(
    private readonly createWorkShiftService: CreateWorkShiftService,
    private readonly deleteWorkShiftService: DeleteWorkShiftService,
    private readonly readWorkShiftsService: ReadWorkShiftsService,
    private readonly updateWorkShiftService: UpdateWorkShiftService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all work shifts',
    description:
      'Retrieves a paginated and filtered list of work shifts with sorting options',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Work shifts retrieved successfully',
    type: AllWorkShiftsResponseDto,
  })
  async findAllWorkShifts(@Query() query: WorkShiftsQueryDto, @Req() request: ReqAdmin) {
    const result = await this.readWorkShiftsService.findAllWorkShifts(
      request.admin,
      query,
    );
    return plainToInstance(
      AllWorkShiftsResponseDto,
      {
        success: true,
        message: 'Work shifts retrieved successfully',
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
    summary: 'Get list of work shifts',
    description: 'Get a list of active work shifts',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Work shifts retrieved successfully',
    type: ListWorkShiftsResponseDto,
  })
  async findSelect(@Query() query: WorkShiftsQueryDto, @Req() request: ReqAdmin) {
    const result = await this.readWorkShiftsService.selectWorkShifts(
      request.admin,
      query.localityId,
    );

    return plainToInstance(
      ListWorkShiftsResponseDto,
      {
        success: true,
        message: 'Work shifts retrieved successfully',
        data: result,
      },
      {
        enableImplicitConversion: true,
      },
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create new work shift' })
  @ApiBody({ type: CreateWorkShiftDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Work shift created successfully',
    type: WorkShiftCreatedResponseDto,
  })
  async createWorkShift(
    @Body() createWorkShiftDto: CreateWorkShiftDto,
    @Req() request: ReqAdmin,
  ) {
    const workShift = await this.createWorkShiftService.create(
      request.admin,
      createWorkShiftDto,
    );

    return plainToInstance(
      WorkShiftCreatedResponseDto,
      {
        success: true,
        message: 'Work shift created successfully',
        data: workShift,
      },
      {
        enableImplicitConversion: true,
      },
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get work shift by ID' })
  @ApiParam({ name: 'id', description: 'Work shift ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Work shift retrieved successfully',
    type: WorkShiftSingleResponseDto,
  })
  async getWorkShiftById(@Param('id') id: WorkShiftId, @Query() query: WorkShiftsQueryDto, @Req() request: ReqAdmin) {
    const workShift = await this.readWorkShiftsService.findById(
      id,
      request.admin,
      query.localityId,
    );

    return plainToInstance(
      WorkShiftSingleResponseDto,
      {
        success: true,
        message: 'Work shift retrieved successfully',
        data: workShift,
      },
      {
        enableImplicitConversion: true,
      },
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update work shift by ID' })
  @ApiParam({ name: 'id', description: 'Work shift ID (UUID)' })
  @ApiBody({ type: UpdateWorkShiftDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Work shift updated successfully',
    type: WorkShiftUpdatedResponseDto,
  })
  async updateWorkShift(
    @Param('id') id: WorkShiftId,
    @Body() updateWorkShiftDto: UpdateWorkShiftDto,
    @Req() request: ReqAdmin,
  ) {
    const workShift = await this.updateWorkShiftService.update(
      id,
      request.admin,
      updateWorkShiftDto,
    );

    return plainToInstance(
      WorkShiftUpdatedResponseDto,
      {
        success: true,
        message: 'Work shift updated successfully',
        data: workShift,
      },
      {
        enableImplicitConversion: true,
      },
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete work shift by ID' })
  @ApiParam({ name: 'id', description: 'Work shift ID (UUID)' })
  @ApiBody({ type: DeleteWorkShiftDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Work shift deleted successfully',
    type: WorkShiftDeletedResponseDto,
  })
  async deleteWorkShift(
    @Param('id') id: WorkShiftId,
    @Body() deleteWorkShiftDto: DeleteWorkShiftDto,
    @Req() request: ReqAdmin,
  ) {
    await this.deleteWorkShiftService.delete(
      id,
      request.admin,
      deleteWorkShiftDto.localityId,
    );

    return plainToInstance(
      WorkShiftDeletedResponseDto,
      {
        success: true,
        message: 'Work shift deleted successfully',
      },
      {
        enableImplicitConversion: true,
      },
    );
  }
}
