import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './addToCart.dto';

export class UpdateCartDto extends PartialType(CreateCartDto) { }
