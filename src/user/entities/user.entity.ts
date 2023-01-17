
import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, CreateDateColumn, UpdateDateColumn, JoinTable, ManyToMany, OneToMany} from 'typeorm';
import * as argon2 from 'argon2'; 
import { BaseEntity } from 'src/shared/base.entity';
import { RoleType } from 'src/shared/enums/roleType.enum';




@Entity('user')
export class UserEntity  extends BaseEntity{

  @PrimaryGeneratedColumn()
  id: string;

  @Column({unique:true})
  username: string;

  @Column({unique:true})
  email: string;

  @Column()
  password: string;

  @Column()
  isActive: boolean;

  @Column({type:'enum',enum:RoleType,default:RoleType.CLIENT})
  role: RoleType;
  
}
