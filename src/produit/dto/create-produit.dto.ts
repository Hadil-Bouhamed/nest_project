import { IsNotEmpty } from 'class-validator';


export class CreateProduitDto {

  @IsNotEmpty()
  readonly reference: string;

  @IsNotEmpty()
  readonly marque: string;

  @IsNotEmpty()
  readonly couleur : string;

  @IsNotEmpty()
  readonly taille_monture: string;

  @IsNotEmpty()
  readonly prix: number;

}