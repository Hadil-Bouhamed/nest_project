import { Controller } from '@nestjs/common';
import { Get, Post, Body, Put, Delete, UsePipes } from '@nestjs/common';
import { ProduitService } from './produit.service';
import { ProduitRO } from './produit.interface'; 
import { CreateProduitDto, UpdateProduitDto } from './dto'; 
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ValidationPipe } from '../shared/validation.pipe';
import { ApiBearerAuth, ApiTags} from '@nestjs/swagger';  
import { produitEntity } from './produit.entity';


@ApiBearerAuth()
@ApiTags('product') 
@Controller('product')
export class ProduitController {
    constructor(private readonly produitService: ProduitService) {}

    @Get('getAll')
    async findAll(): Promise<produitEntity[]> {
      return await this.produitService.findAll();
    }
   

  @Get('get')
  async findMe(@Body('reference') reference: string , @Body('marque') marque: string): Promise<produitEntity> {
    return await this.produitService.findOne(reference,marque);
  }
 
  @Put('update')
  async update(@Body('reference') productReference: string , @Body('marque') marque: string , @Body('productData') productData: UpdateProduitDto) {
    return await this.produitService.update(productReference,marque,productData);
  } 

 @UsePipes(new ValidationPipe())  
  @Post('post')
  async create(@Body('product') productData: CreateProduitDto) {
  
    const {reference,marque} = productData;
    const product = await this.produitService.findOne(reference,marque);

    const errors = {product: ' product is found'};
    if (product) throw new HttpException({errors}, 401);
    
    return await this.produitService.create(productData);
    
  } 
  

  @Delete('delete')
  async delete(@Body('reference') productReference: string , @Body('marque') marque: string) {
    return await this.produitService.delete(productReference,marque);
  }
 
 
}