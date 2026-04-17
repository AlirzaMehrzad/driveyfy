import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UsersService } from '../users/users.service';
import { CommentDocument, Comments } from './schema/comment.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Products, ProductDocument } from '../products/schema/product.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Products.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectQueue('comments-queue')
    private readonly commentsQueue: Queue,
    @InjectModel(Comments.name)
    private readonly commentModel: Model<CommentDocument>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) { }

  createComment = async (createCommentDto: CreateCommentDto) => {
    const comment = await this.commentModel.create(createCommentDto);
    if (!comment)
      return { success: false, status: 400, message: 'Comment not created' };

    // Comment summarization
    const product = await this.productModel.findById(createCommentDto.productRef);
    if (product) {
      const currentCount = product.numberOfUnGeneratedComments || 0;
      if (currentCount < 4) { // every 5 comments, we generate a summary
        product.numberOfUnGeneratedComments = currentCount + 1;
        await product.save();
      } else {
        product.numberOfUnGeneratedComments = 0;
        await product.save();
        await this.commentsQueue.add('summarize-comments', { productId: createCommentDto.productRef });
      }
    }

    return {
      success: true,
      status: 200,
      message: 'Comment created and waiting for admin approval',
    };
  };

  findAllComments = async (getCommentsDto) => {
    const allUserComments = await this.commentModel.find({
      userRef: getCommentsDto.userId,
    });
    const allProductComments = await this.commentModel.find({
      userRef: getCommentsDto.productId,
    });
    return {
      success: true,
      message: 'کامنت ها پیدا شد',
      allUserComments,
      allProductComments,
    };
  };

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
