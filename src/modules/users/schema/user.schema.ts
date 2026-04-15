import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = Users & Document;

@Schema({ timestamps: true })
export class Users {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false, length: 25 })
  firstname: string;

  @Prop({ required: false, length: 25 })
  lastname: string;

  @Prop({ required: false })
  age: number;

  @Prop({ required: false })
  image: string;

  @Prop({ required: false, default: false })
  isActive: boolean;

  @Prop({ required: false })
  birthDate: Date;

  @Prop({ required: false })
  accupation: string;

  @Prop({ required: false })
  nationalCode: string;

  @Prop({ type: [Object], default: [] })
  favorites: object[];

  @Prop()
  activationToken?: string;

  @Prop()
  activationExpires?: Date;

  @Prop({ default: true })
  isUser: boolean;
}

export const UserSchema = SchemaFactory.createForClass(Users);
