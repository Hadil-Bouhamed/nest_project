import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User as UserEntity } from 'src/shared/types/user';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'; 
import * as jwt from 'jsonwebtoken';
import { CreateUserDto, LoginUserDto } from 'src/user/dto';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { JwtStrategy } from './strategy/jwt.strategy';

@Injectable()
export class AuthService {
    constructor(
        private userService:UserService,
        private jwtService:JwtService
    ){}
    async validateUser(login:LoginUserDto){
        let user = await this.userService.findByMail(login.email)
        if (user){
            let isMatch = await bcrypt.compare(login.password,user.password)
            if(isMatch){
                let token = jwt.sign({
                    "email":user.email,
                    "role":user.role
                    },process.env.JWT_SECRET,{expiresIn:"7200s"})
                    return {
                        token
                    }
            }
            throw new UnauthorizedException('Wrong password!')
        }
        throw new NotFoundException('Email not found') ;
    }
    async register(user:CreateUserDto):Promise<UserEntity>{
        return await this.userService.createUser(user)
    }
}
