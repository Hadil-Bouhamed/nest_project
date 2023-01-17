import { IsEmail, IsEnum, IsNotEmpty, IsOptional, Length, matches, Matches, Max, Min } from 'class-validator';
import { RoleType } from 'src/shared/enums/roleType.enum';

export class CreateUserDto {

  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

}