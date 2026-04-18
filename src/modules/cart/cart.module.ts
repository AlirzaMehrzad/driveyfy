import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cart } from './schema/cart.schema';
import { CartSchema } from './schema/cart.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule { }
