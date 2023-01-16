import { Controller } from '@nestjs/common';
import { Get, Post, Body, Put, Delete, Param,  UsePipes } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}
  @Get('all')
  async getAll(){
    return this.userService.findAll();
  }
  @Get('/:id')
  async getById(@Param('id') id:string){
    return this.userService.findOneById(id);
  }
  @Post('new')
  async createUser(@Body() payload:CreateUserDto){
    return this.userService.createUser(payload);
  }
  @Delete('/:id')
  async deleteUser(@Param('id') id:string){
    return this.userService.deleteUser(id);
  }
}
