import { Type } from '@nestjs/passport';
import { Document } from 'mongoose';
import { RoleType } from '../enums/roleType.enum';
export interface User extends Document {
    username: string;
    readonly password: string;
    role: RoleType;
    email: string;
    created: Date;
  }