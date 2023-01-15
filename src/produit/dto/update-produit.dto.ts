import { IsNotEmpty } from 'class-validator';


export class UpdateProduitDto {

  @IsNotEmpty()
  readonly couleur : string;

  @IsNotEmpty()
  readonly taille_monture: string;

  @IsNotEmpty()
  readonly prix: number;

}