import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2'; 
import { CreateUserDto, LoginUserDto } from 'src/user/dto';

@Injectable()
export class AuthService {
    constructor(
        private userService:UserService,
        private jwtService:JwtService
    ){}
    async validateUser(login:LoginUserDto){
        const user = await this.userService.findByMail(login.email)
        if (user){
            const isMatch = await argon2.verify(login.password,user.password)
            if(isMatch){
                delete user.password
                let token = this.jwtService.sign({
                    email:user.email,
                })
                return {
                    token
                }
            }
        }
        return null;
    }
    async register(user:CreateUserDto):Promise<UserEntity>{
        return await this.userService.createUser(user)
    }
    async linkUserWithDevice(token:string,user:UserEntity){
        let userInfo = await this.userService.findOneById(user.id);
        if(userInfo){
            let newUserInfo = {
                ...userInfo,
                deviceToken:token
            }
            await this.userService.internalUpdate(newUserInfo);
            return token;
        } else {
        throw new NotFoundException('SORRY NO USER WITH THIS ID');
      }
    }
}
