import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CreateProductDto } from 'src/modules/products/dto/create-product.dto';
import { ProductsService } from 'src/modules/products/products.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly productsService: ProductsService) { }


  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }

  // ======================Products=====================
  @Post('/products/create')
  @UseGuards(JwtAuthGuard)
  async createProduct(@Req() req, @Body() createProductDto: CreateProductDto) {
    const adminAccessLevel = await this.adminService.getAdminAccessLevel(req);
    console.log(adminAccessLevel);
    if (!adminAccessLevel.includes('products')) {
      return {
        status: 403,
        success: false,
        message: 'Admin access level not found',
      }
    }
    const product = await this.productsService.createProduct(req, createProductDto)
    return {
      status: 200,
      success: true,
      message: 'Product created successfully',
      product,
    }
  }

}
