import { IsEnum, IsNotEmpty } from 'class-validator';
import { ColorsEnum } from '../enums/colors.enum';
import { MarqueEnum } from '../enums/marque.enum';
import { TailleEnum } from '../enums/taille.enum';


export class CreateProduitDto {

  @IsNotEmpty()
  reference: string;

  @IsNotEmpty()
  refProduct:string;
  @IsNotEmpty()
  @IsEnum(MarqueEnum)
  marque: MarqueEnum;

  @IsNotEmpty()
  @IsEnum(ColorsEnum)
  couleur : ColorsEnum;

  @IsNotEmpty()
  @IsEnum(TailleEnum)
  taille_monture: TailleEnum;

  @IsNotEmpty()
  prix: number;

  @IsNotEmpty()
  prixReel:number;

  @IsNotEmpty()
  stock_amount:number;
}