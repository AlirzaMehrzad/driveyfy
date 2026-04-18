import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Products } from "src/modules/products/schema/product.schema";
import { Users } from "src/modules/users/schema/user.schema";

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class Cart {
    @Prop({ required: true, ref: Users.name })
    userRef: Types.ObjectId;

    // array of object which includes all product object and quantity of each product
    @Prop([{
        productRef: { type: Types.ObjectId, ref: Products.name },
        quantity: { type: Number, default: 1 }
    }])
    items: { productRef: Types.ObjectId; quantity: number }[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
