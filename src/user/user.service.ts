import { Injectable,NotFoundException,BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import {CreateUserDto} from './dto';
const jwt = require('jsonwebtoken');
import * as bcrypt from 'bcrypt';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import { RoleType } from 'src/shared/enums/roleType.enum';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await (await this.userRepository.find()).map((usr)=>{
      if(usr.role==RoleType.CLIENT ){
        delete usr.products
        delete usr.deletedAt
        return usr
      }
      delete usr.deletedAt
      return usr
    });
  }

  async findOneById(id:string): Promise<UserEntity> {
    let tmp = await this.userRepository.findOne({
      where : {id},
    });
    delete tmp.products
    delete tmp.deletedAt
    return tmp
  }
  async findByMail(email:string):Promise<UserEntity>{
    let tmp = await this.userRepository.findOne({
      where : {email},
    });
    delete tmp.products
    delete tmp.deletedAt
    return tmp
  }
  async createUser(payload: CreateUserDto): Promise<UserEntity> {
    let email = payload.email
    let name = payload.username
    if (await this.userRepository.findOne({ 
      where:{ email }
     })) {
      throw new UnauthorizedException('Email Exists Already!')
    }
    if (await this.userRepository.findOne({ 
      where:{ username:name }
     })) {
      throw new UnauthorizedException('Username Exists Already!')
    }
    try {
      // encrypt password
      let newPass = await bcrypt.hash(payload.password, 9);
      const newUser = await this.userRepository.create({
        username: payload.username,
        email: payload.email,
        password: newPass,
        role:RoleType.CLIENT,
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
  async updateToSeller(id:string):Promise<UserEntity>{
    let tmp = await this.userRepository.findOneBy({id})
    if(!tmp){
      throw new NotFoundException('Not found client sir')
    }
    let newUser = await this.userRepository.preload({
      ...tmp,
      role:RoleType.SELLER     
    })
    tmp = await this.userRepository.save(newUser)
    delete tmp.password
    delete tmp.deletedAt
    return tmp
  }
  async updateToAdmin(id:string):Promise<any>{
    let tmp = await this.userRepository.findOneBy({id})
    if(!tmp){
      throw new NotFoundException('Not found client sir')
    }
    let newUser = await this.userRepository.preload({
      ...tmp,
      role:RoleType.ADMIN     
    })
    tmp = await this.userRepository.save(newUser)
    delete tmp.password
    delete tmp.deletedAt
    return tmp
  }
}