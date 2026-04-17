import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Comments, CommentsSchema } from './schema/comment.schema';
import { Products, ProductSchema } from '../products/schema/product.schema';
import { BullModule } from '@nestjs/bull';
import { AiModule } from '../ai/ai.module';
import { CommentAiProcessor } from './ai/comment-ai.processor';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comments.name, schema: CommentsSchema },
      { name: Products.name, schema: ProductSchema }
    ]),
    BullModule.registerQueue({ name: 'comments-queue' }),
    AiModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentAiProcessor],
})
export class CommentsModule { }
