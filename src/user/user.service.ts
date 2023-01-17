import { Injectable,NotFoundException,BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import {CreateUserDto} from './dto';
const jwt = require('jsonwebtoken');
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import * as argon2 from 'argon2'; 
import { RoleType } from 'src/shared/enums/roleType.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOneById(id:string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where : {id},
    });
  }
  async findByMail(email:string):Promise<UserEntity>{
    return await this.userRepository.findOne({where:{email}})
  }
  async createUser(payload: CreateUserDto): Promise<UserEntity> {

    const {username, email, password} = payload;
    if (await this.userRepository.findOne({ 
      where:{ email }
     })) {
      throw new UnauthorizedException('User Exists Already!')
    }
    try {
      // encrypt password
      const passwordCrypt = await argon2.hash(password);
      const newUser = await this.userRepository.create({
        username: payload.username,
        email: payload.email,
        password: passwordCrypt,
        role:RoleType.CLIENT,
        isActive:false
      });
      return await this.userRepository.save(newUser);
  }catch(err){
    throw new HttpException({
      message:'Error_REGISTER'
    },
    HttpStatus.INTERNAL_SERVER_ERROR)
  }
  }
  async internalUpdate(user: UserEntity) {
    await this.userRepository.save(user);
  }
  async deleteUser(id:string):Promise<DeleteResult>{
    return this.userRepository.softDelete(id)
  }

}