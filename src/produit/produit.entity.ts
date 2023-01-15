
import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';
import { BaseEntity } from 'src/shared/base.entity';




@Entity('produit')
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