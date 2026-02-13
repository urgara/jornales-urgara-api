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
  CreateCompanyDto,
  UpdateCompanyDto,
  CompaniesQueryDto,
} from 'src/dtos/company/requests';
import {
  AllCompaniesResponseDto,
  ListCompaniesResponseDto,
  CompanyCreatedResponseDto,
  CompanyDeletedResponseDto,
  CompanySingleResponseDto,
  CompanyUpdatedResponseDto,
} from 'src/dtos/company/responses';
import { AccessLevel } from 'src/decorators/common/auth';
import { JwtGuard } from 'src/guards/common/auth';
import { AdminRole } from 'src/types/auth';
import {
  CompanyCreateService,
  CompanyDeleteService,
  CompanyReadService,
  CompanyUpdateService,
} from 'src/services/company';
import type { CompanyId } from 'src/types/company';

@ApiTags('Companies')
@Controller('companies')
@UseGuards(JwtGuard)
export class CompanyController {
  constructor(
    private readonly companyCreateService: CompanyCreateService,
    private readonly companyDeleteService: CompanyDeleteService,
    private readonly companyReadService: CompanyReadService,
    private readonly companyUpdateService: CompanyUpdateService,
  ) {}

  @Get()
  @AccessLevel(AdminRole.ONLY_READ)
  @ApiOperation({
    summary: 'Get all companies',
    description:
      'Retrieves a paginated and filtered list of companies with sorting options',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Companies retrieved successfully',
    type: AllCompaniesResponseDto,
  })
  async findAllCompanies(@Query() query: CompaniesQueryDto) {
    const result = await this.companyReadService.findAllCompanies(query);
    return plainToInstance(AllCompaniesResponseDto, {
      success: true,
      message: 'Companies retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  }

  @Get('select')
  @AccessLevel(AdminRole.ONLY_READ)
  @ApiOperation({
    summary: 'Get list of companies',
    description: 'Get a list of active companies for select dropdown',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Companies retrieved successfully',
    type: ListCompaniesResponseDto,
  })
  async findSelect() {
    const result = await this.companyReadService.selectCompanies();

    return plainToInstance(ListCompaniesResponseDto, {
      success: true,
      message: 'Companies retrieved successfully',
      data: result,
    });
  }

  @Get('count')
  @AccessLevel(AdminRole.ONLY_READ)
  @ApiOperation({
    summary: 'Get total count of active companies',
    description: 'Returns the total number of active companies',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Count retrieved successfully',
  })
  async getCount() {
    const total = await this.companyReadService.count();
    return {
      success: true,
      message: 'Count retrieved successfully',
      data: { total },
    };
  }

  @Post()
  @AccessLevel(AdminRole.LOCAL)
  @ApiOperation({ summary: 'Create new company' })
  @ApiBody({ type: CreateCompanyDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Company created successfully',
    type: CompanyCreatedResponseDto,
  })
  async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    const company = await this.companyCreateService.create(createCompanyDto);

    return plainToInstance(CompanyCreatedResponseDto, {
      success: true,
      message: 'Company created successfully',
      data: company,
    });
  }

  @Get(':id')
  @AccessLevel(AdminRole.ONLY_READ)
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Company retrieved successfully',
    type: CompanySingleResponseDto,
  })
  async getCompanyById(@Param('id') id: CompanyId) {
    const company = await this.companyReadService.findById(id);

    return plainToInstance(CompanySingleResponseDto, {
      success: true,
      message: 'Company retrieved successfully',
      data: company,
    });
  }

  @Patch(':id')
  @AccessLevel(AdminRole.LOCAL)
  @ApiOperation({ summary: 'Update company by ID' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiBody({ type: UpdateCompanyDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Company updated successfully',
    type: CompanyUpdatedResponseDto,
  })
  async updateCompany(
    @Param('id') id: CompanyId,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    const company = await this.companyUpdateService.update(
      id,
      updateCompanyDto,
    );

    return plainToInstance(CompanyUpdatedResponseDto, {
      success: true,
      message: 'Company updated successfully',
      data: company,
    });
  }

  @Delete(':id')
  @AccessLevel(AdminRole.LOCAL)
  @ApiOperation({ summary: 'Delete company by ID' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Company deleted successfully',
    type: CompanyDeletedResponseDto,
  })
  async deleteCompany(@Param('id') id: CompanyId) {
    await this.companyDeleteService.delete(id);

    return plainToInstance(CompanyDeletedResponseDto, {
      success: true,
      message: 'Company deleted successfully',
    });
  }
}
