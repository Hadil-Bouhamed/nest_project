import * as mongoose from 'mongoose';
import { ColorsEnum } from 'src/produit/enums/colors.enum';
import { MarqueEnum } from 'src/produit/enums/marque.enum';
import { TailleEnum } from 'src/produit/enums/taille.enum';
import { SupportProd } from '../enums/availability.enum';

export const ProductSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  reference: String,
  categorie: String,
  marque: {
    type:String,
    enum:MarqueEnum,
  },
  couleur: {
    type:String,
    enum:ColorsEnum,
    default:ColorsEnum.Black
  },
  taille: {
    type:String,
    enum:TailleEnum,
    default:TailleEnum.taille1
  },
  prix: Number,
  prixReel:Number,
  pourcentage_admin:{
    type:Number,
    default:8
  },
  stock_amount:Number,
  solded:{
    type:Number,
    default:0,
  },
  shoped:{
    type:Number,
    default:0,
  },
  support:{
    type:String,
    enum:SupportProd,
    default:SupportProd.CONTINUE
  },
  created: {
    type: Date,
    default: Date.now,
  },
});