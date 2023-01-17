import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from '@ngneat/falso';
import { CreateUserDto, LoginUserDto } from 'src/user/dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { GetUser,RoleInterceptor } from './decorator/getUser.decorator';
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
    register(@Body() registerDto: CreateUserDto): Promise<UserEntity> {
      return this.authService.register(registerDto);
    }
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@GetUser() user: User) {
      return user;
    }
  
    @UseGuards(JwtAuthGuard)
    @Post('profile/expotoken')
    PostExpoToken(@GetUser() user: UserEntity, @Body() token) {
      return this.authService.linkUserWithDevice(token.token, user);
    }
  }
  
