import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Users } from 'src/modules/users/schema/user.schema';

export type ProductDocument = Products & Document;

@Schema({ timestamps: true })
export class Products {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  price: number;

  @Prop({ length: 250 })
  description: string;

  @Prop([String])
  images: string[];

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: Users.name, required: true })
  owner: Types.ObjectId;

  @Prop({ type: String, default: null })
  summary: string;

  @Prop({ type: Date, default: null })
  summaryUpdatedAt: Date;

  @Prop({ ref: Users.name, type: Types.ObjectId })
  deleted: {
    status: { type: Boolean; default: false };
    deletedAt: { type: Date; default: null };
    deletedBy: { type: Types.ObjectId | null };
  };
}

export const ProductSchema = SchemaFactory.createForClass(Products);
