import { IsEmail, IsNotEmpty, IsStrongPassword, IsBoolean, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsBoolean()
  isAdmin: boolean;
}
