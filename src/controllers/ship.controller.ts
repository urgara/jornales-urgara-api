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
  CreateShipDto,
  UpdateShipDto,
  ShipsQueryDto,
} from 'src/dtos/ship/requests';
import {
  AllShipsResponseDto,
  ListShipsResponseDto,
  ShipCreatedResponseDto,
  ShipDeletedResponseDto,
  ShipSingleResponseDto,
  ShipUpdatedResponseDto,
} from 'src/dtos/ship/responses';
import { AccessLevel } from 'src/decorators/common/auth';
import { JwtGuard } from 'src/guards/common/auth';
import { AdminRole } from 'src/types/auth';
import {
  ShipCreateService,
  ShipDeleteService,
  ShipReadService,
  ShipUpdateService,
} from 'src/services/ship';
import type { ShipId } from 'src/types/ship';

@ApiTags('Ships')
@Controller('ships')
@UseGuards(JwtGuard)
export class ShipController {
  constructor(
    private readonly shipCreateService: ShipCreateService,
    private readonly shipDeleteService: ShipDeleteService,
    private readonly shipReadService: ShipReadService,
    private readonly shipUpdateService: ShipUpdateService,
  ) {}

  @Get()
  @AccessLevel(AdminRole.ONLY_READ)
  @ApiOperation({
    summary: 'Get all ships',
    description:
      'Retrieves a paginated and filtered list of ships with sorting options',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ships retrieved successfully',
    type: AllShipsResponseDto,
  })
  async findAllShips(@Query() query: ShipsQueryDto) {
    const result = await this.shipReadService.findAllShips(query);
    return plainToInstance(AllShipsResponseDto, {
      success: true,
      message: 'Ships retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  }

  @Get('select')
  @AccessLevel(AdminRole.ONLY_READ)
  @ApiOperation({
    summary: 'Get list of ships',
    description: 'Get a list of active ships for select dropdown',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ships retrieved successfully',
    type: ListShipsResponseDto,
  })
  async findSelect() {
    const result = await this.shipReadService.selectShips();

    return plainToInstance(ListShipsResponseDto, {
      success: true,
      message: 'Ships retrieved successfully',
      data: result,
    });
  }

  @Get('count')
  @AccessLevel(AdminRole.ONLY_READ)
  @ApiOperation({
    summary: 'Get total count of active ships',
    description: 'Returns the total number of active ships',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Count retrieved successfully',
  })
  async getCount() {
    const total = await this.shipReadService.count();
    return {
      success: true,
      message: 'Count retrieved successfully',
      data: { total },
    };
  }

  @Post()
  @AccessLevel(AdminRole.LOCAL)
  @ApiOperation({ summary: 'Create new ship' })
  @ApiBody({ type: CreateShipDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Ship created successfully',
    type: ShipCreatedResponseDto,
  })
  async createShip(@Body() createShipDto: CreateShipDto) {
    const ship = await this.shipCreateService.create(createShipDto);

    return plainToInstance(ShipCreatedResponseDto, {
      success: true,
      message: 'Ship created successfully',
      data: ship,
    });
  }

  @Get(':id')
  @AccessLevel(AdminRole.ONLY_READ)
  @ApiOperation({ summary: 'Get ship by ID' })
  @ApiParam({ name: 'id', description: 'Ship ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ship retrieved successfully',
    type: ShipSingleResponseDto,
  })
  async getShipById(@Param('id') id: ShipId) {
    const ship = await this.shipReadService.findById(id);

    return plainToInstance(ShipSingleResponseDto, {
      success: true,
      message: 'Ship retrieved successfully',
      data: ship,
    });
  }

  @Patch(':id')
  @AccessLevel(AdminRole.LOCAL)
  @ApiOperation({ summary: 'Update ship by ID' })
  @ApiParam({ name: 'id', description: 'Ship ID' })
  @ApiBody({ type: UpdateShipDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ship updated successfully',
    type: ShipUpdatedResponseDto,
  })
  async updateShip(
    @Param('id') id: ShipId,
    @Body() updateShipDto: UpdateShipDto,
  ) {
    const ship = await this.shipUpdateService.update(id, updateShipDto);

    return plainToInstance(ShipUpdatedResponseDto, {
      success: true,
      message: 'Ship updated successfully',
      data: ship,
    });
  }

  @Delete(':id')
  @AccessLevel(AdminRole.LOCAL)
  @ApiOperation({ summary: 'Delete ship by ID' })
  @ApiParam({ name: 'id', description: 'Ship ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ship deleted successfully',
    type: ShipDeletedResponseDto,
  })
  async deleteShip(@Param('id') id: ShipId) {
    await this.shipDeleteService.delete(id);

    return plainToInstance(ShipDeletedResponseDto, {
      success: true,
      message: 'Ship deleted successfully',
    });
  }
}
