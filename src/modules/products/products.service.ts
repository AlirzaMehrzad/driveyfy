import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDocument, Products } from './schema/product.schema';
import { Model, Types } from 'mongoose';
import { UsersService } from 'src/modules/users/users.service';
import { AiService } from 'src/ai/ai.service';
import { productsDescriptionPrompt } from 'src/ai/constants/prompt';

@Injectable()
export class ProductsService {
  constructor(
    private readonly aiService: AiService,
    @InjectModel(Products.name) private productModel: Model<ProductDocument>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) { }

  createProduct = async (req, createProductDto: CreateProductDto) => {
    const prompt = await productsDescriptionPrompt(createProductDto.title);
    const aiGeneratedDescription = await this.aiService.generateWithOllama(prompt);
    console.log(aiGeneratedDescription);

    createProductDto.description = aiGeneratedDescription;
    const userId = new Types.ObjectId(req.user.id);
    const product = await this.productModel.create({
      ...createProductDto,
      owner: userId,
    });
    if (!product)
      throw new HttpException('مشکلی در ایجاد محصول بهوجود آمد', 400);

    return product;
  };

  findAllProducts = async (query) => {
    const prodcuts = await this.productModel
      .find()
      .sort({ createdAt: -1 })
      .skip((query.page - 1) * query.limit)
      .limit(query.limit ? parseInt(query.limit) : 10);

    return prodcuts;
  };

  findProductById = async (id) => {
    const product = await this.productModel.findById(id);
    if (!product) return false;

    return product;
  };

  updateProduct = async (req, id, updateProductDto: UpdateProductDto) => {
    const userId = new Types.ObjectId(req.user.id);
    const product = await this.productModel.findOneAndUpdate(
      {
        _id: id,
        owner: userId,
        'deleted.status': { $ne: true },
      },
      { $set: updateProductDto },
      { new: true },
    );
    if (!product) return false;

    return product;
  };

  removeProduct = async (req, id) => {
    const userId = new Types.ObjectId(req.user.id);
    const product = await this.productModel.findOneAndUpdate(
      {
        _id: id,
        owner: userId,
        'deleted.status': { $ne: true },
      },
      {
        $set: {
          'deleted.status': true,
          'deleted.deletedAt': new Date(),
          'deleted.deletedBy': userId,
        },
      },
      { new: true },
    );

    if (!product) return false;

    return true;
  };
}
