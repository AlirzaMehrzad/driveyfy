import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Products, ProductSchema } from './schema/product.schema';
import { Users, UserSchema } from 'src/modules/users/schema/user.schema';
import { UsersService } from 'src/modules/users/users.service';
import { UsersModule } from 'src/modules/users/users.module';
import { AiModule } from 'src/ai/ai.module';
import { BullModule } from '@nestjs/bull';
import { ProductAiProcessor } from './ai/product-ai.processor';

@Module({
  imports: [
    AiModule,
    BullModule.registerQueue({
      name: 'products-queue',
    }),
    MongooseModule.forFeature([{ name: Products.name, schema: ProductSchema }]),
    forwardRef(() => UsersModule),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductAiProcessor],
  exports: [ProductsService],
})
export class ProductsModule { }
