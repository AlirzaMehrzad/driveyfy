import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/addToCart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schema/cart.schema';
import { Model } from 'mongoose';

@Injectable()
export class CartService {

  constructor(@InjectModel(Cart.name) private readonly cartModel: Model<Cart>) { }

  addToCart = async (addToCartDto: CreateCartDto) => {
    const { productRef, quantity } = addToCartDto;
    const cart = await this.cartModel.findOne({ userRef: addToCartDto.userRef });
    if (!cart) {
      const newCart = new this.cartModel({ userRef: addToCartDto.userRef, items: [{ productRef, quantity }] });
      return await newCart.save();
    }
    const item = cart.items.find((item) => item.productRef.toString() === productRef.toString());
    if (item) {
      item.quantity += quantity;
      return await cart.save();
    }
    cart.items.push({ productRef, quantity });
    return await cart.save();
  }

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
