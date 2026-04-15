
import { IsEmail, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
export class CreateAdminDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    accessLevel: string[];

    @IsOptional()
    @MaxLength(25)
    firstname: string;

    @IsOptional()
    @MaxLength(25)
    lastname: string;

    @IsOptional()
    isActive: boolean;
}
