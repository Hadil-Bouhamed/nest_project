
import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinColumn} from 'typeorm';
import { BaseEntity } from 'src/shared/base.entity';
import { TailleEnum } from '../enums/taille.enum';
import { MarqueEnum } from '../enums/marque.enum';
import { ColorsEnum } from '../enums/colors.enum';
import { SupportProd } from 'src/shared/enums/availability.enum';
import { type } from 'os';
import { UserEntity } from 'src/user/entities/user.entity';




@Entity('produit')
export class produitEntity  extends BaseEntity{

  @PrimaryGeneratedColumn()
  id: string;
  
  @Column({unique:true})
  reference: string;

  @Column()
  refProduit : string

  @Column({type:'enum',enum:MarqueEnum})
  marque: MarqueEnum;

  @Column({type:"enum",enum:ColorsEnum,default:ColorsEnum.Black})
  couleur: ColorsEnum;
  
  @Column({type:'enum',enum:TailleEnum,default:TailleEnum.taille2})
  taille_monture: TailleEnum;
  
  @Column()
  prix: number;
  
  @Column()
  prixReel: number;
  
  @Column({default:4})
  pourcentage_admin:number;
  
  @Column()
  stock_amount: number;

  @Column({default:0})
  solded:number;

  @Column({default:0})
  shoped:number;

  @Column({type:"enum",enum:SupportProd,default:SupportProd.CONTINUE})
  support :SupportProd;

  @ManyToOne(()=>UserEntity,(seller)=>seller.products)
  owner:UserEntity

  
  
}