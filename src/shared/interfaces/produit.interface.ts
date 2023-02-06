import { ColorsEnum } from "src/produit/enums/colors.enum";
import { MarqueEnum } from "src/produit/enums/marque.enum";
import { TailleEnum } from "src/produit/enums/taille.enum";
import { EtatProd, SupportProd } from "../enums/availability.enum";
import { User } from "../types/user"

export interface NegotiatePourcentageInter {
  id?:string,
  ref?:string,
  prix?:number,
  admin_pourcentage?:number
}

export interface AddStockInter{
  id?:string,
  ref?:string,
  amount:number,
  prixReel:number,
}
export interface ProductForGuests{
  _id:string,
  reference : string,
  categorie:string,
  marque : MarqueEnum,
  couleur : ColorsEnum,
  taille : TailleEnum ,
  prix : number,
  availability ?: EtatProd|string,
  owner?:{
    _id:string,
    username:string
  },
}
export interface ProductForSeller{
  _id:string,
  reference : string,
  categorie:string,
  marque : MarqueEnum,
  couleur : ColorsEnum,
  taille : TailleEnum ,
  stock : number,
  status : SupportProd,
  achete:number,
  vendu:number,
  taxAdminUnite:number,  
  prix : number,
  prixReel : number,
  profitUnite:number,
  owner: User
}
export interface FactureSeller{
  categorie:string,
  sold:number,
  achete:number,
  achatTotal:number,
  taxAdminTotal:number,
  estimationStock:number,
  profitActuel:number,
  profitEstime:number
}
export interface FactureAdmin{
  prixUnitaire:number,
  sold:number,
  stock:number,
  pourcentage:number,
  profitActuel:number,
  estimationStock:number
}