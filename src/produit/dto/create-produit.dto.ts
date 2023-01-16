import { IsNotEmpty } from 'class-validator';


export class CreateProduitDto {

  @IsNotEmpty()
  reference: string;

  @IsNotEmpty()
  marque: string;

  @IsNotEmpty()
  couleur : string;

  @IsNotEmpty()
  taille_monture: string;

  @IsNotEmpty()
  prix: number;

}