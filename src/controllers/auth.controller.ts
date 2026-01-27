import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
  Req,
  Res,
  Query,
  Patch,
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
  LoginService,
  AdminCreateService,
  AdminReadService,
  AdminUpdateService,
  AdminDeleteService,
} from '../services/auth';
import { AccessLevel } from '../decorators/common/auth';
import type { ReqAdmin, ReqWithClientInfo } from '../types/auth';
import apiConfig from 'src/config/api.config';
import { COOKIE_CONFIG } from 'src/config/cookie.config';
import { plainToInstance } from 'class-transformer';
import {
  CreateAdminDto,
  AdminsQueryDto,
  LoginDto,
  UpdateAdminDto,
} from 'src/dtos/auth/requests';
import {
  AdminCreatedResponseDto,
  AdminDeletedResponseDto,
  AdminListResponseDto,
  AdminSingleResponseDto,
  AdminUpdatedResponseDto,
  LoginResponseDto,
  LogoutResponseDto,
} from 'src/dtos/auth/responses';
import { JwtGuard } from 'src/guards/common/auth';
import type { Response } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly adminCreateService: AdminCreateService,
    private readonly adminReadService: AdminReadService,
    private readonly adminUpdateService: AdminUpdateService,
    private readonly adminDeleteService: AdminDeleteService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login admin' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: ReqWithClientInfo,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const ip = req.REQUEST_CLIENT_IP;
    const userAgent = req.REQUEST_USER_AGENT;

    const clientToken = await this.loginService.login({
      ...loginDto,
      ip,
      userAgent,
    });
    res.cookie(apiConfig().COOKIE_KEY_NAME, clientToken, COOKIE_CONFIG);

    return plainToInstance(LoginResponseDto, {
      success: true,
      message: 'Login successful',
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Logout admin' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logout successful',
    type: LogoutResponseDto,
  })
  async logout(
    @Req() req: ReqAdmin,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LogoutResponseDto> {
    await this.loginService.logout(req.admin.sessionId);

    res.clearCookie(apiConfig().COOKIE_KEY_NAME);

    return plainToInstance(LogoutResponseDto, {
      success: true,
      message: 'Logout successful',
    });
  }

  @Post('admins')
  @AccessLevel(AdminRole.ADMIN)
  @ApiOperation({ summary: 'Create new admin' })
  @ApiBody({ type: CreateAdminDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Admin created successfully',
    type: AdminCreatedResponseDto,
  })
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    const admin = await this.adminCreateService.create(createAdminDto);

    return plainToInstance(AdminCreatedResponseDto, {
      success: true,
      message: 'Admin created successfully',
      data: admin,
    });
  }

  @Get('admins')
  @AccessLevel(AdminRole.ADMIN)
  @ApiOperation({
    summary: 'Get all admins with pagination, sorting and filters',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admins retrieved successfully',
    type: AdminListResponseDto,
  })
  async getAllAdmins(@Query() query: AdminsQueryDto) {
    const result = await this.adminReadService.findAll(query);

    return plainToInstance(AdminListResponseDto, {
      success: true,
      message: 'Admins retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  }

  @Get('admin')
  @AccessLevel(AdminRole.LOCAL) /* Aca tiene q estar el Rol mas bajo */
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin retrieved successfully',
    type: AdminSingleResponseDto,
  })
  async getAdminById(@Req() request: ReqAdmin) {
    const admin = await this.adminReadService.findAdminByCookie(request.admin);

    return plainToInstance(AdminSingleResponseDto, {
      success: true,
      message: 'Admin retrieved successfully',
      data: admin,
    });
  }

  @Patch('admins/:id')
  @AccessLevel(AdminRole.ADMIN)
  @ApiOperation({ summary: 'Update admin' })
  @ApiParam({ name: 'id', description: 'Admin ID' })
  @ApiBody({ type: UpdateAdminDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin updated successfully',
    type: AdminUpdatedResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Admin not found',
  })
  async updateAdmin(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    const admin = await this.adminUpdateService.update(id, updateAdminDto);

    return plainToInstance(AdminUpdatedResponseDto, {
      success: true,
      message: 'Admin updated successfully',
      data: admin,
    });
  }

  @Delete('admins/:id')
  @AccessLevel(AdminRole.ADMIN)
  @ApiOperation({ summary: 'Delete admin' })
  @ApiParam({ name: 'id', description: 'Admin ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Admin deleted successfully',
    type: AdminDeletedResponseDto,
  })
  async deleteAdmin(@Param('id') id: string) {
    await this.adminDeleteService.delete(id);

    return plainToInstance(AdminDeletedResponseDto, {
      success: true,
      message: 'Admin deleted successfully',
    });
  }
}
