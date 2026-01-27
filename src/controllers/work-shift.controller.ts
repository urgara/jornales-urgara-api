import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Patch,
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
  BaseValueWorkShiftsQueryDto,
  CreateOrUpdateWorkShiftConfigDto,
  CreateValuesWorkShiftsDto,
  CreateWorkShiftDto,
  UpdateWorkShiftDto,
  WorkShiftsQueryDto,
} from 'src/dtos/work-shift/requests';
import {
  AllBaseValueWorkShiftsResponseDto,
  AllWorkShiftsResponseDto,
  ListBaseValueWorkShiftsResponseDto,
  ListWorkShiftsResponseDto,
  WorkShiftCreatedResponseDto,
  WorkShiftDeletedResponseDto,
  WorkShiftSingleResponseDto,
  WorkShiftUpdatedResponseDto,
  WorkShiftConfigResponseDto,
  WorkShiftsCreatedResponseDto,
} from 'src/dtos/work-shift/responses';
import { AccessLevel } from 'src/decorators/common/auth';
import { JwtGuard } from 'src/guards/common/auth';
import { AdminRole } from 'src/types/auth';
import {
  CreateConfigWorkShiftService,
  CreateValuesWorkShiftService,
  CreateWorkShiftService,
  DeleteWorkShiftService,
  ReadConfigWorkShiftService,
  ReadWorkShiftsService,
  UpdateWorkShiftService,
} from 'src/services/work-shift';
import type { WorkShiftConfigId, WorkShiftId } from '../types/work-shift';

@ApiTags('Work Shifts')
@Controller('work-shifts')
@UseGuards(JwtGuard)
@AccessLevel(AdminRole.ADMIN)
export class WorkShiftController {
  constructor(
    private readonly createConfigWorkShiftService: CreateConfigWorkShiftService,
    private readonly createValuesWorkShiftService: CreateValuesWorkShiftService,
    private readonly createWorkShiftService: CreateWorkShiftService,
    private readonly deleteWorkShiftService: DeleteWorkShiftService,
    private readonly readConfigWorkShiftService: ReadConfigWorkShiftService,
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
  async findAllWorkShifts(@Query() query: WorkShiftsQueryDto) {
    const result = await this.readWorkShiftsService.findAllWorkShifts(query);
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
  async findSelect() {
    const result = await this.readWorkShiftsService.selectWorkShifts();

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

  @Get('values/select/:id/:date')
  @ApiOperation({
    summary: 'Get list of value work shifts by locality and date',
    description:
      'Get a list of active value work shifts filtered by locality ID (donde está el puerto) and date',
  })
  @ApiParam({
    name: 'id',
    description: 'Locality ID (donde está el puerto)',
    type: 'number',
  })
  @ApiParam({
    name: 'date',
    description: 'Date in YYYY-MM-DD format',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Value work shifts retrieved successfully',
    type: ListBaseValueWorkShiftsResponseDto,
  })
  async findBaseValueSelectByDate(
    @Param('id', ParseIntPipe) id: number,
    @Param('date') date: string,
  ) {
    const result = await this.readWorkShiftsService.selectValueWorkShifts(
      id,
      date,
    );

    return plainToInstance(
      ListBaseValueWorkShiftsResponseDto,
      {
        success: true,
        message: 'Value work shifts retrieved successfully',
        data: result,
      },
      {
        enableImplicitConversion: true,
      },
    );
  }

  @Get('values/select/:id')
  @ApiOperation({
    summary: 'Get list of value work shifts by locality',
    description: 'Get a list of active value work shifts filtered by locality ID (donde está el puerto)',
  })
  @ApiParam({
    name: 'id',
    description: 'Locality ID (donde está el puerto)',
    type: 'number',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Value work shifts retrieved successfully',
    type: ListBaseValueWorkShiftsResponseDto,
  })
  async findBaseValueSelect(@Param('id', ParseIntPipe) id: number) {
    const result = await this.readWorkShiftsService.selectValueWorkShifts(id);

    return plainToInstance(
      ListBaseValueWorkShiftsResponseDto,
      {
        success: true,
        message: 'Value work shifts retrieved successfully',
        data: result,
      },
      {
        enableImplicitConversion: true,
      },
    );
  }

  @Get('base-values')
  @ApiOperation({
    summary: 'Get all base value work shifts with their value work shifts',
    description:
      'Retrieves a paginated and filtered list of base value work shifts including all their associated value work shifts and work shifts',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Base value work shifts retrieved successfully',
    type: AllBaseValueWorkShiftsResponseDto,
  })
  async findAllBaseValueWorkShifts(
    @Query() query: BaseValueWorkShiftsQueryDto,
  ) {
    const result =
      await this.readWorkShiftsService.findAllBaseValueWorkShifts(query);
    return plainToInstance(
      AllBaseValueWorkShiftsResponseDto,
      {
        success: true,
        message: 'Base value work shifts retrieved successfully',
        data: result.data,
        pagination: result.pagination,
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
  async createWorkShift(@Body() createWorkShiftDto: CreateWorkShiftDto) {
    const workShift =
      await this.createWorkShiftService.create(createWorkShiftDto);

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

  @Post('values')
  @ApiOperation({ summary: 'Create work shift values (batch)' })
  @ApiBody({ type: CreateValuesWorkShiftsDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Work shift values created successfully',
    type: CreateValuesWorkShiftsDto,
  })
  async createValuesWorkShifts(
    @Body() createValuesWorkShiftsDto: CreateValuesWorkShiftsDto,
  ) {
    await this.createValuesWorkShiftService.create(createValuesWorkShiftsDto);

    return plainToInstance(
      WorkShiftsCreatedResponseDto,
      {
        success: true,
        message: 'Work shift values created successfully',
      },
      {
        enableImplicitConversion: true,
      },
    );
  }

  @Get('config/:id')
  @ApiOperation({ summary: 'Get work shift configuration by locality ID' })
  @ApiParam({
    name: 'id',
    description: 'Work shift configuration ID (Locality ID - donde está el puerto)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Work shift configuration retrieved successfully',
    type: WorkShiftConfigResponseDto,
  })
  async getConfig(@Param('id', ParseIntPipe) id: WorkShiftConfigId) {
    const data = await this.readConfigWorkShiftService.findById(id);
    return plainToInstance(
      WorkShiftConfigResponseDto,
      {
        success: true,
        message: 'Work shift configuration retrieved successfully',
        data,
      },
      {
        enableImplicitConversion: true,
      },
    );
  }

  @Put('config')
  @ApiOperation({
    summary: 'Create or update work shift configuration (upsert)',
    description:
      'Creates a new work shift configuration for a locality if it does not exist, or updates it if it already exists',
  })
  @ApiBody({ type: CreateOrUpdateWorkShiftConfigDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Work shift configuration created or updated successfully',
    type: WorkShiftConfigResponseDto,
  })
  async upsertConfig(@Body() data: CreateOrUpdateWorkShiftConfigDto) {
    await this.createConfigWorkShiftService.upsert(data);

    return plainToInstance(
      WorkShiftConfigResponseDto,
      {
        success: true,
        message: 'Work shift configuration saved successfully',
      },
      {
        enableImplicitConversion: true,
      },
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get work shift by ID' })
  @ApiParam({ name: 'id', description: 'Work shift ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Work shift retrieved successfully',
    type: WorkShiftSingleResponseDto,
  })
  async getWorkShiftById(@Param('id') id: WorkShiftId) {
    const workShift = await this.readWorkShiftsService.findById(id);

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
  @ApiParam({ name: 'id', description: 'Work shift ID' })
  @ApiBody({ type: UpdateWorkShiftDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Work shift updated successfully',
    type: WorkShiftUpdatedResponseDto,
  })
  async updateWorkShift(
    @Param('id') id: WorkShiftId,
    @Body() updateWorkShiftDto: UpdateWorkShiftDto,
  ) {
    const workShift = await this.updateWorkShiftService.update(
      id,
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
  @ApiParam({ name: 'id', description: 'Work shift ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Work shift deleted successfully',
    type: WorkShiftDeletedResponseDto,
  })
  async deleteWorkShift(@Param('id') id: WorkShiftId) {
    await this.deleteWorkShiftService.delete(id);

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
