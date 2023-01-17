import { IsEmail, IsEnum, IsNotEmpty, IsOptional, Length, matches, Matches, Max, Min } from 'class-validator';
import { RoleType } from 'src/shared/enums/roleType.enum';

export class CreateUserDto {

  @Max(25)
  @Matches(RegExp("/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/"))
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Min(6)
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEnum(RoleType)
  roles:RoleType
  
  validMail:boolean
}