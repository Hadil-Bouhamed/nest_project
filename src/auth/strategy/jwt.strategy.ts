import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RoleType } from 'src/shared/enums/roleType.enum';
import { Repository } from 'typeorm';
import { User } from 'src/shared/types/user';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
      @InjectModel('User')
      private userRepository:Model<User>
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }
  async validate(payload:any){
    const user= await this.userRepository.findOne({
      email:payload.email
    })
    if(!user){
      throw new UnauthorizedException()
    }
    let res = {
      ...user
    }
    delete res.password
    return res
  }

}