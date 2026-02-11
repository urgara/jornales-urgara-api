import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  Get,
  Param,
  Patch,
  Query,
  Delete,
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
  CreateWorkerDto,
  UpdateWorkerDto,
  DeleteWorkerDto,
  WorkersQueryDto,
} from 'src/dtos/worker/requests';
import {
  AllWorkersResponseDto,
  ListWorkersResponseDto,
  WorkerCreatedResponseDto,
  WorkerDeletedResponseDto,
  WorkerSingleResponseDto,
  WorkerUpdatedResponseDto,
} from 'src/dtos/worker/responses';
import { AccessLevel } from 'src/decorators/common/auth';
import { JwtGuard } from 'src/guards/common/auth';
import { AdminRole, type ReqAdmin } from 'src/types/auth';
import {
  WorkerCreateService,
  WorkerDeleteService,
  WorkerReadService,
  WorkerUpdateService,
} from 'src/services/worker';
import type { WorkerId } from 'src/types/worker';

@ApiTags('Workers')
@Controller('workers')
@UseGuards(JwtGuard)
export class WorkerController {
  constructor(
    private readonly workerCreateService: WorkerCreateService,
    private readonly workerDeleteService: WorkerDeleteService,
    private readonly workerReadService: WorkerReadService,
    private readonly workerUpdateService: WorkerUpdateService,
  ) {}

  @Get()
  @AccessLevel(AdminRole.ONLY_READ)
  @ApiOperation({
    summary: 'Get all workers',
    description:
      'Retrieves a paginated and filtered list of workers with sorting options',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Workers retrieved successfully',
    type: AllWorkersResponseDto,
  })
  async findAllWorkers(
    @Query() query: WorkersQueryDto,
    @Req() request: ReqAdmin,
  ) {
    const result = await this.workerReadService.findAllWorkers(
      request.admin,
      query,
    );
    return plainToInstance(
      AllWorkersResponseDto,
      {
        success: true,
        message: 'Workers retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      },
      {
        enableImplicitConversion: true,
      },
    );
  }

  @Get('select')
  @AccessLevel(AdminRole.ONLY_READ)
  @ApiOperation({
    summary: 'Get list of workers',
    description: 'Get a list of active workers for select dropdown',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Workers retrieved successfully',
    type: ListWorkersResponseDto,
  })
  async findSelect(@Query() query: WorkersQueryDto, @Req() request: ReqAdmin) {
    const result = await this.workerReadService.selectWorkers(
      request.admin,
      query.localityId,
    );

    return plainToInstance(
      ListWorkersResponseDto,
      {
        success: true,
        message: 'Workers retrieved successfully',
        data: result,
      },
      {
        enableImplicitConversion: true,
      },
    );
  }

  @Get('count')
  @AccessLevel(AdminRole.ONLY_READ)
  @ApiOperation({
    summary: 'Get total count of active workers',
    description:
      'Returns the total number of active workers in the specified locality',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Count retrieved successfully',
  })
  async getCount(@Query() query: WorkersQueryDto, @Req() request: ReqAdmin) {
    const total = await this.workerReadService.count(
      request.admin,
      query.localityId,
    );
    return {
      success: true,
      message: 'Count retrieved successfully',
      data: { total },
    };
  }

  @Post()
  @AccessLevel(AdminRole.LOCAL)
  @ApiOperation({ summary: 'Create new worker' })
  @ApiBody({ type: CreateWorkerDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Worker created successfully',
    type: WorkerCreatedResponseDto,
  })
  async createWorker(
    @Body() createWorkerDto: CreateWorkerDto,
    @Req() request: ReqAdmin,
  ) {
    const worker = await this.workerCreateService.create(
      request.admin,
      createWorkerDto,
    );

    return plainToInstance(
      WorkerCreatedResponseDto,
      {
        success: true,
        message: 'Worker created successfully',
        data: worker,
      },
      {
        enableImplicitConversion: true,
      },
    );
  }

  @Get(':id')
  @AccessLevel(AdminRole.ONLY_READ)
  @ApiOperation({ summary: 'Get worker by ID' })
  @ApiParam({ name: 'id', description: 'Worker ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Worker retrieved successfully',
    type: WorkerSingleResponseDto,
  })
  async getWorkerById(
    @Param('id') id: WorkerId,
    @Query() query: WorkersQueryDto,
    @Req() request: ReqAdmin,
  ) {
    const worker = await this.workerReadService.findById(
      id,
      request.admin,
      query.localityId,
    );

    return plainToInstance(
      WorkerSingleResponseDto,
      {
        success: true,
        message: 'Worker retrieved successfully',
        data: worker,
      },
      {
        enableImplicitConversion: true,
      },
    );
  }

  @Patch(':id')
  @AccessLevel(AdminRole.LOCAL)
  @ApiOperation({ summary: 'Update worker by ID' })
  @ApiParam({ name: 'id', description: 'Worker ID (UUID)' })
  @ApiBody({ type: UpdateWorkerDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Worker updated successfully',
    type: WorkerUpdatedResponseDto,
  })
  async updateWorker(
    @Param('id') id: WorkerId,
    @Body() updateWorkerDto: UpdateWorkerDto,
    @Req() request: ReqAdmin,
  ) {
    const worker = await this.workerUpdateService.update(
      id,
      request.admin,
      updateWorkerDto,
    );

    return plainToInstance(
      WorkerUpdatedResponseDto,
      {
        success: true,
        message: 'Worker updated successfully',
        data: worker,
      },
      {
        enableImplicitConversion: true,
      },
    );
  }

  @Delete(':id')
  @AccessLevel(AdminRole.LOCAL)
  @ApiOperation({ summary: 'Delete worker by ID' })
  @ApiParam({ name: 'id', description: 'Worker ID (UUID)' })
  @ApiBody({ type: DeleteWorkerDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Worker deleted successfully',
    type: WorkerDeletedResponseDto,
  })
  async deleteWorker(
    @Param('id') id: WorkerId,
    @Body() deleteWorkerDto: DeleteWorkerDto,
    @Req() request: ReqAdmin,
  ) {
    await this.workerDeleteService.delete(
      id,
      request.admin,
      deleteWorkerDto.localityId,
    );

    return plainToInstance(
      WorkerDeletedResponseDto,
      {
        success: true,
        message: 'Worker deleted successfully',
      },
      {
        enableImplicitConversion: true,
      },
    );
  }
}
