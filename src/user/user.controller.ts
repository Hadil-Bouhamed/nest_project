import { Controller, UseGuards } from '@nestjs/common';
import { Get, Post, Body, Put, Delete, Param,  UsePipes } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common/decorators';
import { RoleInterceptor } from 'src/auth/interceptors/roles.interceptor';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RoleType } from 'src/shared/enums/roleType.enum';
import { CreateUserDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  
  @Get('')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new RoleInterceptor(RoleType.ADMIN))
  async getAll(){
    return this.userService.findAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new RoleInterceptor(RoleType.ADMIN))
  async getById(@Param('id') id:string){
    return this.userService.findOneById(id);
  }
  
  @Put('updateSeller/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new RoleInterceptor(RoleType.ADMIN))
  async updateToSeller(@Param('id') id:string){
    return this.userService.updateToSeller(id)
  }
  @Put('updateAdmin/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new RoleInterceptor(RoleType.ADMIN))
  async updateToAdmin(@Param('id') id:string){
    return this.userService.updateToAdmin(id)
  }
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new RoleInterceptor(RoleType.ADMIN))
  async deleteUser(@Param('id') id:string){
    return this.userService.deleteUser(id);
  }
}
