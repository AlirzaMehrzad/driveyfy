import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Products } from 'src/modules/products/schema/product.schema';
import { Users } from 'src/modules/users/schema/user.schema';

export type CommentDocument = Comments & Document;

@Schema({ timestamps: true })
export class Comments {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true, ref: Users.name })
  userRef: Types.ObjectId;

  @Prop({ required: true, ref: Products.name })
  productRef: Types.ObjectId;

  @Prop({ default: false })
  admittedByAdmin: boolean;

  @Prop({ default: false })
  admittedByAi: boolean;

  @Prop({ default: 0 })
  likesCount: number;
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);
