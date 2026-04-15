import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Post,
  Req,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all users' })
  async findAll() {
    const users = await this.usersService.findAllUsers();
    return {
      status: 200,
      message: 'Contacts found',
      data: users,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Find one user' })
  findOne(@Param('id') id: Types.ObjectId) {
    return this.usersService.findOneUserById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update one user' })
  @ApiParam({ name: 'id', type: Types.ObjectId, description: 'user Id' })
  update(
    @Param('id') id: Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUserById(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove one user' })
  @ApiParam({ name: 'id', type: Types.ObjectId, description: 'user Id' })
  remove(@Param('id') id: Types.ObjectId) {
    return this.usersService.removeUserById(id);
  }
}
