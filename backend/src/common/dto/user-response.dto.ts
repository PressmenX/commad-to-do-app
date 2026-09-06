import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserResponseDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;
}
