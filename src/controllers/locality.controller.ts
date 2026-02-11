import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { AdminRole } from 'src/types/auth';
import {
  LocalityCreateService,
  LocalityReadService,
  LocalityUpdateService,
  LocalityDeleteService,
} from '../services/locality';
import { AccessLevel } from '../decorators/common/auth';
import { plainToInstance } from 'class-transformer';
import {
  CreateLocalityDto,
  UpdateLocalityDto,
  LocalitiesQueryDto,
} from 'src/dtos/auth/requests';
import {
  LocalityCreatedResponseDto,
  LocalityDeletedResponseDto,
  LocalityListResponseDto,
  LocalityUpdatedResponseDto,
  LocalityResponseDto,
  LocalitySelectResponseDto,
} from 'src/dtos/auth/responses';

@ApiTags('Localities')
@Controller('localities')
export class LocalityController {
  constructor(
    private readonly localityCreateService: LocalityCreateService,
    private readonly localityReadService: LocalityReadService,
    private readonly localityUpdateService: LocalityUpdateService,
    private readonly localityDeleteService: LocalityDeleteService,
  ) {}

  @Get()
  @AccessLevel(AdminRole.ONLY_READ)
  @ApiOperation({
    summary: 'Get all localities with pagination, sorting and filters',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Localities retrieved successfully',
    type: LocalityListResponseDto,
  })
  async getAllLocalities(@Query() query: LocalitiesQueryDto) {
    const result = await this.localityReadService.findAll(
      query.page,
      query.limit,
      query.sortBy,
      query.sortOrder,
      query.name,
      query.province,
    );

    return plainToInstance(LocalityListResponseDto, {
      success: true,
      message: 'Localities retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  }

  @Get('select')
  @AccessLevel(AdminRole.ONLY_READ)
  @ApiOperation({
    summary: 'Get list of localities',
    description: 'Get a list of all localities',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Localities retrieved successfully',
    type: LocalitySelectResponseDto,
  })
  async findSelect() {
    const result = await this.localityReadService.select();

    return plainToInstance(LocalitySelectResponseDto, {
      success: true,
      message: 'Localities retrieved successfully',
      data: result,
    });
  }

  @Get(':id')
  @AccessLevel(AdminRole.ONLY_READ)
  @ApiOperation({ summary: 'Get locality by ID' })
  @ApiParam({ name: 'id', description: 'Locality ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Locality retrieved successfully',
    type: LocalityResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Locality not found',
  })
  async getLocalityById(@Param('id') id: string) {
    const locality = await this.localityReadService.findById(id);

    return plainToInstance(LocalityResponseDto, locality, {
      excludeExtraneousValues: true,
    });
  }

  @Post()
  @AccessLevel(AdminRole.ADMIN)
  @ApiOperation({ summary: 'Create new locality' })
  @ApiBody({ type: CreateLocalityDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Locality created successfully',
    type: LocalityCreatedResponseDto,
  })
  async createLocality(@Body() createLocalityDto: CreateLocalityDto) {
    const locality = await this.localityCreateService.create(createLocalityDto);

    return plainToInstance(LocalityCreatedResponseDto, {
      success: true,
      message: 'Locality created successfully',
      data: locality,
    });
  }

  @Patch(':id')
  @AccessLevel(AdminRole.ADMIN)
  @ApiOperation({ summary: 'Update locality' })
  @ApiParam({ name: 'id', description: 'Locality ID' })
  @ApiBody({ type: UpdateLocalityDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Locality updated successfully',
    type: LocalityUpdatedResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Locality not found',
  })
  async updateLocality(
    @Param('id') id: string,
    @Body() updateLocalityDto: UpdateLocalityDto,
  ) {
    const locality = await this.localityUpdateService.update(
      id,
      updateLocalityDto,
    );

    return plainToInstance(
      LocalityUpdatedResponseDto,
      {
        success: true,
        message: 'Locality updated successfully',
        data: locality,
      },
      { excludeExtraneousValues: true },
    );
  }

  @Delete(':id')
  @AccessLevel(AdminRole.ADMIN)
  @ApiOperation({ summary: 'Delete locality' })
  @ApiParam({ name: 'id', description: 'Locality ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Locality deleted successfully',
    type: LocalityDeletedResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Locality not found',
  })
  async deleteLocality(@Param('id') id: string) {
    await this.localityDeleteService.delete(id);

    return plainToInstance(LocalityDeletedResponseDto, {
      success: true,
      message: 'Locality deleted successfully',
    });
  }
}
