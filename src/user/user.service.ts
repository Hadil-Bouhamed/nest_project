import { Injectable,NotFoundException,BadRequestException, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/shared/types/user';
import {CreateUserDto} from './dto';
const jwt = require('jsonwebtoken');
import * as bcrypt from 'bcrypt';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import { RoleType } from 'src/shared/enums/roleType.enum';
import { InjectModel} from '@nestjs/mongoose'
import { Model } from 'mongoose';
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userRepository: Model<User>
  ) {}

  async findAll(): Promise<Partial<User>[]> {
    return await (await this.userRepository.find()).map((usr)=>{
      let res = {
        ...usr
      }
      delete res.password
      return res
    })
  }

  async findOneById(id:string): Promise<Partial<User>> {
    let tmp = await this.userRepository.findById(id)
    let res = {
      ...tmp['_doc']
    }
    delete res.password
    return res
  }
  async findByMail(email:string):Promise<User>{
    let tmp = await this.userRepository.findOne({email:email});
    return tmp
  }
  async createUser(payload: CreateUserDto): Promise<User> {
    let email = payload.email
    let name = payload.username
    if (await this.userRepository.findOne({ 
     email:email
     })) {
      throw new UnauthorizedException('Email Exists Already!')
    }
    if (await this.userRepository.findOne({ 
      username:name
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
      await newUser.save();
      return newUser
  }catch(err){
    throw new HttpException({
      message:'Error_REGISTER'
    },
    HttpStatus.INTERNAL_SERVER_ERROR)
  }
  }

  async deleteUser(id:string):Promise<any>{
    let res = await this.userRepository.findByIdAndDelete(id)
    if(!res){
      throw new NotFoundException('No User is deleted')
    }else{
      return `User ${res.username} is deleted `
    }
  }
  async updateToSeller(id:string):Promise<User>{
    let tmp = await this.userRepository.findById(id)
    if(!tmp){
      throw new NotFoundException('Not found client sir')
    }
    let newUser ={
      ...tmp['_doc'],
      role:RoleType.SELLER     
    }
    await tmp.updateOne(newUser)
    newUser = {
      ...tmp['_doc']
    }
    delete newUser.password
    return newUser
  }
  async updateToAdmin(id:string):Promise<any>{
    let tmp = await this.userRepository.findById(id)
    if(!tmp){
      throw new NotFoundException('Not found client sir')
    }
    let newUser ={
      ...tmp['_doc'],
      role:RoleType.ADMIN     
    }
    await tmp.updateOne(newUser)
    newUser = {
      ...tmp['_doc']
    }
    delete newUser.password
    return newUser
}
}
