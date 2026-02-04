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
  CreateTerminalDto,
  UpdateTerminalDto,
  TerminalsQueryDto,
} from 'src/dtos/terminal/requests';
import {
  AllTerminalsResponseDto,
  ListTerminalsResponseDto,
  TerminalCreatedResponseDto,
  TerminalDeletedResponseDto,
  TerminalSingleResponseDto,
  TerminalUpdatedResponseDto,
} from 'src/dtos/terminal/responses';
import { AccessLevel } from 'src/decorators/common/auth';
import { AdminRole } from 'src/types/auth';
import {
  TerminalCreateService,
  TerminalDeleteService,
  TerminalReadService,
  TerminalUpdateService,
} from 'src/services/terminal';
import type { TerminalId } from 'src/types/terminal';

@ApiTags('Terminals')
@Controller('terminals')
@AccessLevel(AdminRole.ADMIN)
export class TerminalController {
  constructor(
    private readonly terminalCreateService: TerminalCreateService,
    private readonly terminalDeleteService: TerminalDeleteService,
    private readonly terminalReadService: TerminalReadService,
    private readonly terminalUpdateService: TerminalUpdateService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all terminals',
    description:
      'Retrieves a paginated and filtered list of terminals with sorting options',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Terminals retrieved successfully',
    type: AllTerminalsResponseDto,
  })
  async findAllTerminals(@Query() query: TerminalsQueryDto) {
    const result = await this.terminalReadService.findAllTerminals(query);
    return plainToInstance(AllTerminalsResponseDto, {
      success: true,
      message: 'Terminals retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  }

  @Get('select')
  @ApiOperation({
    summary: 'Get list of terminals',
    description: 'Get a list of active terminals for select dropdown',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Terminals retrieved successfully',
    type: ListTerminalsResponseDto,
  })
  async findSelect() {
    const result = await this.terminalReadService.selectTerminals();

    return plainToInstance(ListTerminalsResponseDto, {
      success: true,
      message: 'Terminals retrieved successfully',
      data: result,
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create new terminal' })
  @ApiBody({ type: CreateTerminalDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Terminal created successfully',
    type: TerminalCreatedResponseDto,
  })
  async createTerminal(@Body() createTerminalDto: CreateTerminalDto) {
    const terminal = await this.terminalCreateService.create(createTerminalDto);

    return plainToInstance(TerminalCreatedResponseDto, {
      success: true,
      message: 'Terminal created successfully',
      data: terminal,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get terminal by ID' })
  @ApiParam({ name: 'id', description: 'Terminal ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Terminal retrieved successfully',
    type: TerminalSingleResponseDto,
  })
  async getTerminalById(@Param('id', ParseUUIDPipe) id: TerminalId) {
    const terminal = await this.terminalReadService.findById(id);

    return plainToInstance(TerminalSingleResponseDto, {
      success: true,
      message: 'Terminal retrieved successfully',
      data: terminal,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update terminal by ID' })
  @ApiParam({ name: 'id', description: 'Terminal ID (UUID)' })
  @ApiBody({ type: UpdateTerminalDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Terminal updated successfully',
    type: TerminalUpdatedResponseDto,
  })
  async updateTerminal(
    @Param('id', ParseUUIDPipe) id: TerminalId,
    @Body() updateTerminalDto: UpdateTerminalDto,
  ) {
    const terminal = await this.terminalUpdateService.update(
      id,
      updateTerminalDto,
    );

    return plainToInstance(TerminalUpdatedResponseDto, {
      success: true,
      message: 'Terminal updated successfully',
      data: terminal,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete terminal by ID' })
  @ApiParam({ name: 'id', description: 'Terminal ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Terminal deleted successfully',
    type: TerminalDeletedResponseDto,
  })
  async deleteTerminal(@Param('id', ParseUUIDPipe) id: TerminalId) {
    await this.terminalDeleteService.delete(id);

    return plainToInstance(TerminalDeletedResponseDto, {
      success: true,
      message: 'Terminal deleted successfully',
    });
  }
}
