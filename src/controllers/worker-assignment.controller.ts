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
  CreateWorkerAssignmentDto,
  UpdateWorkerAssignmentDto,
  WorkerAssignmentsQueryDto,
} from 'src/dtos/worker-assignment/requests';
import {
  AllWorkerAssignmentsResponseDto,
  WorkerAssignmentCreatedResponseDto,
  WorkerAssignmentSingleResponseDto,
  WorkerAssignmentUpdatedResponseDto,
} from 'src/dtos/worker-assignment/responses';
import { AccessLevel } from 'src/decorators/common/auth';
import { JwtGuard } from 'src/guards/common/auth';
import { AdminRole } from 'src/types/auth';
import {
  WorkerAssignmentCreateService,
  WorkerAssignmentReadService,
  WorkerAssignmentUpdateService,
} from 'src/services/worker-assignment';
import type { WorkerAssignmentId } from 'src/types/worker-assignment';

@ApiTags('Worker Assignments')
@Controller('worker-assignments')
@UseGuards(JwtGuard)
@AccessLevel(AdminRole.ADMIN)
export class WorkerAssignmentController {
  constructor(
    private readonly workerAssignmentCreateService: WorkerAssignmentCreateService,
    private readonly workerAssignmentReadService: WorkerAssignmentReadService,
    private readonly workerAssignmentUpdateService: WorkerAssignmentUpdateService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all worker assignments',
    description:
      'Retrieves a paginated and filtered list of worker assignments with sorting options',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Worker assignments retrieved successfully',
    type: AllWorkerAssignmentsResponseDto,
  })
  async findAllAssignments(@Query() query: WorkerAssignmentsQueryDto) {
    const result =
      await this.workerAssignmentReadService.findAll(query);

    return plainToInstance(
      AllWorkerAssignmentsResponseDto,
      {
        success: true,
        message: 'Worker assignments retrieved successfully',
        data: result.data,
        pagination: result.pagination,
      },
      {
        enableImplicitConversion: true,
      },
    );
  }

  @Post()
  @ApiOperation({ summary: 'Create new worker assignment' })
  @ApiBody({ type: CreateWorkerAssignmentDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Worker assignment created successfully',
    type: WorkerAssignmentCreatedResponseDto,
  })
  async createAssignment(
    @Body() createWorkerAssignmentDto: CreateWorkerAssignmentDto,
  ) {
    const assignment =
      await this.workerAssignmentCreateService.create(
        createWorkerAssignmentDto,
      );

    return plainToInstance(
      WorkerAssignmentCreatedResponseDto,
      {
        success: true,
        message: 'Worker assignment created successfully',
        data: assignment,
      },
      {
        enableImplicitConversion: true,
      },
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get worker assignment by ID' })
  @ApiParam({ name: 'id', description: 'Worker assignment ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Worker assignment retrieved successfully',
    type: WorkerAssignmentSingleResponseDto,
  })
  async getAssignmentById(@Param('id') id: WorkerAssignmentId) {
    const assignment = await this.workerAssignmentReadService.findById(id);

    return plainToInstance(
      WorkerAssignmentSingleResponseDto,
      {
        success: true,
        message: 'Worker assignment retrieved successfully',
        data: assignment,
      },
      {
        enableImplicitConversion: true,
      },
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update worker assignment by ID' })
  @ApiParam({ name: 'id', description: 'Worker assignment ID' })
  @ApiBody({ type: UpdateWorkerAssignmentDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Worker assignment updated successfully',
    type: WorkerAssignmentUpdatedResponseDto,
  })
  async updateAssignment(
    @Param('id') id: WorkerAssignmentId,
    @Body() updateWorkerAssignmentDto: UpdateWorkerAssignmentDto,
  ) {
    const assignment =
      await this.workerAssignmentUpdateService.update(
        id,
        updateWorkerAssignmentDto,
      );

    return plainToInstance(
      WorkerAssignmentUpdatedResponseDto,
      {
        success: true,
        message: 'Worker assignment updated successfully',
        data: assignment,
      },
      {
        enableImplicitConversion: true,
      },
    );
  }

}
