import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  imports:[
    UserModule,
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({
      defaultStrategy:'jwt'
    }),
    JwtModule.register({
      secret:process.env.JWT_SECRET,
      signOptions:{expiresIn:"7200s"}
    }),
  ],
  providers: [AuthService,JwtStrategy,ConfigService],
  controllers: [AuthController]
})
export class AuthModule {}
