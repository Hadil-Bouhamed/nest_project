import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RoleType } from 'src/shared/enums/roleType.enum';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
      @InjectRepository(UserEntity)
      private userRepository:Repository<UserEntity>
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload:any){
    const user= await this.userRepository.findOne({
      where:{email:payload.email}
    })
    if(!user){
      throw new UnauthorizedException()
    }
    delete user.password
    return
  }

}