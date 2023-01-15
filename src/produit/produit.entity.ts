
import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert} from 'typeorm';
import { IsEmail } from 'class-validator';
import * as argon2 from 'argon2'; 
import { BaseEntity } from 'src/shared/base.entity';




@Entity('user')
export class produitEntity  extends BaseEntity{

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reference: string;
 
  @Column()
  marque: string;

  @Column()
  couleur: string;

  @Column()
  taille_monture: string;

  @Column()
  prix: number;

  
}