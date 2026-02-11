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
  CreateTerminalDto,
  UpdateTerminalDto,
  TerminalsQueryDto,
  DeleteTerminalDto,
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
import { AdminRole, type ReqAdmin } from 'src/types/auth';
import {
  TerminalCreateService,
  TerminalDeleteService,
  TerminalReadService,
  TerminalUpdateService,
} from 'src/services/terminal';
import type { TerminalId } from 'src/types/terminal';

@ApiTags('Terminals')
@Controller('terminals')
export class TerminalController {
  constructor(
    private readonly terminalCreateService: TerminalCreateService,
    private readonly terminalDeleteService: TerminalDeleteService,
    private readonly terminalReadService: TerminalReadService,
    private readonly terminalUpdateService: TerminalUpdateService,
  ) {}

  @Get()
  @AccessLevel(AdminRole.ONLY_READ)
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
  async findAllTerminals(
    @Query() query: TerminalsQueryDto,
    @Req() request: ReqAdmin,
  ) {
    const result = await this.terminalReadService.findAllTerminals(
      request.admin,
      query,
    );
    return plainToInstance(AllTerminalsResponseDto, {
      success: true,
      message: 'Terminals retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  }

  @Get('select')
  @AccessLevel(AdminRole.ONLY_READ)
  @ApiOperation({
    summary: 'Get list of terminals',
    description: 'Get a list of active terminals for select dropdown',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Terminals retrieved successfully',
    type: ListTerminalsResponseDto,
  })
  async findSelect(
    @Query() query: TerminalsQueryDto,
    @Req() request: ReqAdmin,
  ) {
    const result = await this.terminalReadService.selectTerminals(
      request.admin,
      query.localityId,
    );

    return plainToInstance(ListTerminalsResponseDto, {
      success: true,
      message: 'Terminals retrieved successfully',
      data: result,
    });
  }

  @Post()
  @AccessLevel(AdminRole.LOCAL)
  @ApiOperation({ summary: 'Create new terminal' })
  @ApiBody({ type: CreateTerminalDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Terminal created successfully',
    type: TerminalCreatedResponseDto,
  })
  async createTerminal(
    @Body() createTerminalDto: CreateTerminalDto,
    @Req() request: ReqAdmin,
  ) {
    const terminal = await this.terminalCreateService.create(
      request.admin,
      createTerminalDto,
    );

    return plainToInstance(TerminalCreatedResponseDto, {
      success: true,
      message: 'Terminal created successfully',
      data: terminal,
    });
  }

  @Get(':id')
  @AccessLevel(AdminRole.ONLY_READ)
  @ApiOperation({ summary: 'Get terminal by ID' })
  @ApiParam({ name: 'id', description: 'Terminal ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Terminal retrieved successfully',
    type: TerminalSingleResponseDto,
  })
  async getTerminalById(
    @Param('id', ParseUUIDPipe) id: TerminalId,
    @Query() query: TerminalsQueryDto,
    @Req() request: ReqAdmin,
  ) {
    const terminal = await this.terminalReadService.findById(
      id,
      request.admin,
      query.localityId,
    );

    return plainToInstance(TerminalSingleResponseDto, {
      success: true,
      message: 'Terminal retrieved successfully',
      data: terminal,
    });
  }

  @Patch(':id')
  @AccessLevel(AdminRole.LOCAL)
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
    @Req() request: ReqAdmin,
  ) {
    const terminal = await this.terminalUpdateService.update(
      id,
      request.admin,
      updateTerminalDto,
    );

    return plainToInstance(TerminalUpdatedResponseDto, {
      success: true,
      message: 'Terminal updated successfully',
      data: terminal,
    });
  }

  @Delete(':id')
  @AccessLevel(AdminRole.LOCAL)
  @ApiOperation({ summary: 'Delete terminal by ID' })
  @ApiParam({ name: 'id', description: 'Terminal ID (UUID)' })
  @ApiBody({ type: DeleteTerminalDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Terminal deleted successfully',
    type: TerminalDeletedResponseDto,
  })
  async deleteTerminal(
    @Param('id', ParseUUIDPipe) id: TerminalId,
    @Body() deleteTerminalDto: DeleteTerminalDto,
    @Req() request: ReqAdmin,
  ) {
    await this.terminalDeleteService.delete(
      id,
      request.admin,
      deleteTerminalDto.localityId,
    );

    return plainToInstance(TerminalDeletedResponseDto, {
      success: true,
      message: 'Terminal deleted successfully',
    });
  }
}
