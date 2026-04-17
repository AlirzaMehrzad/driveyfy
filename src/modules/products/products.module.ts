import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Products, ProductSchema } from './schema/product.schema';
import { UsersModule } from 'src/modules/users/users.module';
import { AiModule } from 'src/ai/ai.module';
import { BullModule } from '@nestjs/bull';
import { ProductAiProcessor } from './ai/product-ai.processor';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { BullBoardModule } from '@bull-board/nestjs';

@Module({
  imports: [
    AiModule,
    BullModule.registerQueue({
      name: 'products-queue',
    }),
    BullBoardModule.forFeature({
      name: 'products-queue',
      adapter: BullAdapter, // Tells the board how to read BullMQ data
    }),
    MongooseModule.forFeature([{ name: Products.name, schema: ProductSchema }]),
    forwardRef(() => UsersModule),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductAiProcessor],
  exports: [ProductsService],
})
export class ProductsModule { }
