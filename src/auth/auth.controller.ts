import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from '@ngneat/falso';
import { CreateUserDto, LoginUserDto } from 'src/user/dto';
import { User as UserEntity } from 'src/shared/types/user';
import { AuthService } from './auth.service';
import { GetUser } from './decorator/getUser.decorator';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guard/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
  
    @Post('login')
    async login(@Body() user:LoginUserDto) {
      return this.authService.validateUser(user);
    }
    @Post('register')
    async register(@Body() registerDto: CreateUserDto): Promise<UserEntity> {
      return this.authService.register(registerDto);
    }
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@GetUser() user: User) {
      return user;
    }
    
  }
  
