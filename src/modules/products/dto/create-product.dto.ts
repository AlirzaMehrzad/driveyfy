import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly category: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0.01, { message: 'قیمت محصول نمیتواند صفر یا کمتر باشد' })
  readonly price: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsArray()
  readonly images: string[];

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'موجودی محصول نمیتواند منفی باشد' })
  readonly stock: number;
}
