import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Get, Post, Body, Put, Delete, UsePipes } from '@nestjs/common';
import { ProduitService } from './produit.service';
import { ProduitRO } from './produit.interface'; 
import { CreateProduitDto, UpdateProduitDto } from './dto'; 
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { ValidationPipe } from '../shared/validation.pipe';  
import { produitEntity } from './produit.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RoleInterceptor } from 'src/auth/decorator/getUser.decorator';
import { RoleType } from 'src/shared/enums/roleType.enum';
 
@Controller('product')
export class ProduitController {
    constructor(private readonly produitService: ProduitService) {}

    @Get('getAll')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new RoleInterceptor(RoleType.ADMIN,RoleType.SELLER))
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