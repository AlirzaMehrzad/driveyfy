import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Types } from 'mongoose';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @UseGuards(JwtAuthGuard) // Ensure that the user is authenticated 
  async create(@Req() req, @Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.createProduct(
      req,
      createProductDto,
    );
    return {
      success: true,
      message: 'Product created successfully',
      data: product,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query('q') query) {
    if (query) {
      const results = await this.productsService.semanticSearch(query);
      return {
        status: 200,
        message: 'Search results received successfully',
        data: results,
      };
    }
    const products = await this.productsService.findAllProducts(query);
    return {
      status: 200,
      message: 'Products list received successfully',
      data: products,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseMongoIdPipe) id: string) {
    const product = await this.productsService.findProductById(id);
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    return {
      status: 200,
      message: 'Product received successfully',
      data: product,
    };
  }

  @Put('/update/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseMongoIdPipe) id: string,
    @Req() req,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productsService.updateProduct(
      req,
      id,
      updateProductDto,
    );
    if (!product) {
      throw new BadRequestException('به‌روزرسانی محصول با مشکل مواجه شد');
    }

    return {
      success: true,
      message: 'محصول با موفقیت به‌روزرسانی شد',
      data: product,
    };
  }

  @Put('/delete/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseMongoIdPipe) id: string, @Req() req) {
    const deleted = await this.productsService.removeProduct(req, id);
    if (!deleted) {
      throw new BadRequestException('حذف محصول با مشکل مواجه شد');
    }

    return { success: true, message: 'محصول با موفقیت حذف شد' };
  }
}
