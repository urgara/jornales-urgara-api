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
  CreateProductDto,
  UpdateProductDto,
  ProductsQueryDto,
} from 'src/dtos/product/requests';
import {
  AllProductsResponseDto,
  ListProductsResponseDto,
  ProductCreatedResponseDto,
  ProductDeletedResponseDto,
  ProductSingleResponseDto,
  ProductUpdatedResponseDto,
} from 'src/dtos/product/responses';
import { AccessLevel } from 'src/decorators/common/auth';
import { AdminRole } from 'src/types/auth';
import {
  ProductCreateService,
  ProductDeleteService,
  ProductReadService,
  ProductUpdateService,
} from 'src/services/product';
import type { ProductId } from 'src/types/product';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productCreateService: ProductCreateService,
    private readonly productDeleteService: ProductDeleteService,
    private readonly productReadService: ProductReadService,
    private readonly productUpdateService: ProductUpdateService,
  ) {}

  @Get()
  @AccessLevel(AdminRole.ONLY_READ)
  @ApiOperation({
    summary: 'Get all products',
    description:
      'Retrieves a paginated and filtered list of products with sorting options',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Products retrieved successfully',
    type: AllProductsResponseDto,
  })
  async findAllProducts(@Query() query: ProductsQueryDto) {
    const result = await this.productReadService.findAllProducts(query);
    return plainToInstance(AllProductsResponseDto, {
      success: true,
      message: 'Products retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  }

  @Get('select')
  @AccessLevel(AdminRole.ONLY_READ)
  @ApiOperation({
    summary: 'Get list of products',
    description: 'Get a list of active products for select dropdown',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Products retrieved successfully',
    type: ListProductsResponseDto,
  })
  async findSelect() {
    const result = await this.productReadService.selectProducts();

    return plainToInstance(ListProductsResponseDto, {
      success: true,
      message: 'Products retrieved successfully',
      data: result,
    });
  }

  @Post()
  @AccessLevel(AdminRole.LOCAL)
  @ApiOperation({ summary: 'Create new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created successfully',
    type: ProductCreatedResponseDto,
  })
  async createProduct(@Body() createProductDto: CreateProductDto) {
    const product = await this.productCreateService.create(createProductDto);

    return plainToInstance(ProductCreatedResponseDto, {
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  }

  @Get(':id')
  @AccessLevel(AdminRole.ONLY_READ)
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product retrieved successfully',
    type: ProductSingleResponseDto,
  })
  async getProductById(@Param('id', ParseUUIDPipe) id: ProductId) {
    const product = await this.productReadService.findById(id);

    return plainToInstance(ProductSingleResponseDto, {
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    });
  }

  @Patch(':id')
  @AccessLevel(AdminRole.LOCAL)
  @ApiOperation({ summary: 'Update product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID (UUID)' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product updated successfully',
    type: ProductUpdatedResponseDto,
  })
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: ProductId,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productUpdateService.update(
      id,
      updateProductDto,
    );

    return plainToInstance(ProductUpdatedResponseDto, {
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  }

  @Delete(':id')
  @AccessLevel(AdminRole.LOCAL)
  @ApiOperation({ summary: 'Delete product by ID' })
  @ApiParam({ name: 'id', description: 'Product ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product deleted successfully',
    type: ProductDeletedResponseDto,
  })
  async deleteProduct(@Param('id', ParseUUIDPipe) id: ProductId) {
    await this.productDeleteService.delete(id);

    return plainToInstance(ProductDeletedResponseDto, {
      success: true,
      message: 'Product deleted successfully',
    });
  }
}
