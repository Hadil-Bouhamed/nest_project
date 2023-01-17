import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { CreateProduitDto } from './create-produit.dto';


export class UpdateProduitDto extends PickType(
  CreateProduitDto,[
    "reference" , "couleur" , "taille_monture"
  ]){}
 