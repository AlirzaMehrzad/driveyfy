import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  IsBoolean,
  IsArray
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @MaxLength(25)
  @IsOptional()
  firstname: string;

  @IsString()
  @MaxLength(25)
  @IsOptional()
  lastname: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsNumber()
  age: number;

  @IsOptional()
  @IsString()
  phone: string;

  // For Admin
  @IsOptional()
  @IsBoolean()
  isUser: boolean;

  @IsOptional()
  @IsArray()
  adminAccessLevel: string[];
}
