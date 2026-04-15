import {
  ConflictException,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument, Users } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductsService } from 'src/modules/products/products.service';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';
import { checkDuplicateFields } from 'src/common/utils/users/duplicate-check.util';
import { CreateProductDto } from '../products/dto/create-product.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) { }

  createUser = async (createUserDto: CreateUserDto) => {
    const newUser = await this.userModel.create(createUserDto);
    const userObj = newUser.toObject();

    const userResponse = plainToInstance(UserResponseDto, userObj, {
      excludeExtraneousValues: true,
    });

    return userResponse;
  };

  findUserByPhoneAndEmail = async (email: string, phone: string) => {
    const user = await this.userModel.findOne({ $or: [{ email }, { phone }] });
    return user;
  };

  findUserByEmail = async (email: string) => {
    const user = await this.userModel.findOne({ email });
    return user;
  };

  findAllUsers = async () => {
    return await this.userModel.find().select('-password -activationToken -activationExpires -isUser');
  };

  findOneUserById = async (id: Types.ObjectId) => {
    const user = await this.userModel.findById(id).select('-password -activationToken -activationExpires -isUser');
    if (!user) return { status: 400, message: 'مخاطب وجود ندارد' };
    return {
      status: 200,
      message: 'مخاطب پیدا شد',
      data: user,
    };
  };

  updateUserById = async (id: Types.ObjectId, updateUserDto: UpdateUserDto) => {
    await checkDuplicateFields(this.userModel, id, updateUserDto, [
      'email',
      'phone',
    ]);
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password');

    if (!updatedUser) {
      throw new NotFoundException('مخاطب پیدا نشد');
    }

    return {
      status: 200,
      message: 'آپدیت مخاطب با موفقیت انجام شد',
      data: updatedUser,
    };
  };

  removeUserById = async (id: Types.ObjectId) => {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) return { status: 400, message: 'این کاربر وجود ندارد' };
    return {
      status: 200,
      message: 'مخاطب حذف شد',
    };
  };
}
