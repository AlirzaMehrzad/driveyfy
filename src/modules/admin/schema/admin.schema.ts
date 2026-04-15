import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true })
export class Admin {
    @Prop({ required: true })
    adminAccessLevel: string[]

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: false })
    firstname: string;

    @Prop({ required: false })
    lastname: string;

    @Prop({ required: false, default: false })
    isActive: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
