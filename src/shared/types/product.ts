import { Document } from 'mongoose';
import { ColorsEnum } from 'src/produit/enums/colors.enum';
import { MarqueEnum } from 'src/produit/enums/marque.enum';
import { TailleEnum } from 'src/produit/enums/taille.enum';
import { SupportProd } from '../enums/availability.enum';
import { User } from './user';

export interface Product extends Document {
  owner: User;
  reference: string;
  categorie: string;
  marque: MarqueEnum;
  couleur:ColorsEnum;
  taille:TailleEnum;
  prix: number;
  prixReel:number;
  pourcentage_admin:number;
  solded:number;
  shoped:number;
  stock_amount:number;
  support:SupportProd;
  created: Date;
}