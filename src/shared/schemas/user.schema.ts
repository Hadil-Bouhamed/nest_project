import * as mongoose from 'mongoose'
import { RoleType } from '../enums/roleType.enum'

export const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        unique:true
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    },
    role:{
        type:String,
        enum:RoleType,
        default:RoleType.CLIENT
    },
    createdAt:{
        type:Date,
        default: Date.now,
    }
})
