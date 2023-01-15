import { Controller } from '@nestjs/common';
import { Get, Post, Body, Put, Delete, Param,  UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRO } from './user.interface'; 
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './dto'; 
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ValidationPipe } from '../shared/validation.pipe';
import { ApiBearerAuth, ApiTags} from '@nestjs/swagger';  
/* import { User } from './user.decorator'; */

@ApiBearerAuth()
@ApiTags('user') 
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

  @Get('get')
  async findMe(/* @User */@Body('email') email: string): Promise<UserRO> {
    return await this.userService.findByEmail(email);
  }
 
  @Put('update')
  async update(/* @User */@Body('email') userEmail: string, @Body('user') userData: UpdateUserDto) {
    return await this.userService.update(userEmail, userData);
  } 

 @UsePipes(new ValidationPipe())  
  @Post('signIn')
  async create(@Body('user') userData: CreateUserDto) {
    return this.userService.create(userData);
  }

  @Delete('users/:slug')
  async delete(@Param() params) {
    return await this.userService.delete(params.slug);
  }

  @UsePipes(new ValidationPipe())  
  @Post('login')
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserRO> {
    const _user = await this.userService.findOne(loginUserDto);

    const errors = {User: ' not found'};
    if (!_user) throw new HttpException({errors}, 401);

    const token = await this.userService.generateJWT(_user);
    const {email, username} = _user;
    const user = {email, token, username};
    return {user}
  } 
}
