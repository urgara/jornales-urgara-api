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
@AccessLevel(AdminRole.ADMIN)
export class WorkerController {
  constructor(
    private readonly workerCreateService: WorkerCreateService,
    private readonly workerDeleteService: WorkerDeleteService,
    private readonly workerReadService: WorkerReadService,
    private readonly workerUpdateService: WorkerUpdateService,
  ) {}

  @Get()
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
  async findAllWorkers(@Query() query: WorkersQueryDto) {
    const result = await this.workerReadService.findAllWorkers(query);
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
  @ApiOperation({
    summary: 'Get list of workers',
    description: 'Get a list of active workers for select dropdown',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Workers retrieved successfully',
    type: ListWorkersResponseDto,
  })
  async findSelect() {
    const result = await this.workerReadService.selectWorkers();

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

  @Post()
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
      createWorkerDto,
      request.admin,
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
  @ApiOperation({ summary: 'Get worker by ID' })
  @ApiParam({ name: 'id', description: 'Worker ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Worker retrieved successfully',
    type: WorkerSingleResponseDto,
  })
  async getWorkerById(@Param('id') id: WorkerId) {
    const worker = await this.workerReadService.findById(id);

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
  ) {
    const worker = await this.workerUpdateService.update(id, updateWorkerDto);

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
  @ApiOperation({ summary: 'Delete worker by ID' })
  @ApiParam({ name: 'id', description: 'Worker ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Worker deleted successfully',
    type: WorkerDeletedResponseDto,
  })
  async deleteWorker(@Param('id') id: WorkerId) {
    await this.workerDeleteService.delete(id);

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
