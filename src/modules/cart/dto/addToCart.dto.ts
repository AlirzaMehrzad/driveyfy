import { IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";
import { Types } from "mongoose";

export class CreateCartDto {
    @IsNotEmpty()
    @IsString()
    userRef: Types.ObjectId;

    @IsNotEmpty()
    @IsObject()
    productRef: Types.ObjectId;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}
