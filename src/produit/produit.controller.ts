import { ProduitService } from './produit.service';
import { CreateProduitDto, UpdateProduitDto } from './dto'; 
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RoleInterceptor } from 'src/auth/interceptors/roles.interceptor';
import { RoleType } from 'src/shared/enums/roleType.enum';
import { UnauthorizedException,NotFoundException, HttpException, BadRequestException } from '@nestjs/common/exceptions';
import { Controller, Get, Param,Query,Post,Body, UseGuards, UseInterceptors, Patch, Put, Delete } from '@nestjs/common';
import { MarqueEnum } from './enums/marque.enum';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { User } from 'src/shared/types/user';
import { AddStockInter } from 'src/shared/interfaces/produit.interface';
 
@Controller('product')
export class ProduitController {
    constructor(private produitService: ProduitService) {}
  
    @Post('add')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new RoleInterceptor(RoleType.ADMIN,RoleType.SELLER))
    async addProd(@GetUser() user :any,@Body() payload:Partial<CreateProduitDto>){
      return this.produitService.addProduct(user,payload)
    }
    @Put('addStock')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new RoleInterceptor(RoleType.SELLER,RoleType.ADMIN))
    async addToStock(@GetUser() user:User,@Body() payload:AddStockInter){
      return this.produitService.addToStock(user.id,payload)
    }
    @Put('stopProd')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new RoleInterceptor(RoleType.SELLER,RoleType.ADMIN))
    async stopProd(@GetUser() user:User,@Body() payload:{id:string}){
      return this.produitService.stopProd(user.id,payload.id)
    }
    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new RoleInterceptor(RoleType.SELLER,RoleType.ADMIN))
    async deleteProd(@GetUser() user:User,@Param('id') id:string){
      return this.deleteProd(user.id,id)
    }
    @Get('All')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new RoleInterceptor(RoleType.ADMIN,RoleType.SELLER))
    async getAllForSeller(){
      return this.produitService.getForAdmins()
    }


    @Get('seller/item')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new RoleInterceptor(RoleType.ADMIN,RoleType.SELLER))
    async getItemForSeller(@Query('ref') ref:string){
      return this.produitService.getItemForSeller(ref)
    }
    @Get('seller/owner')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new RoleInterceptor(RoleType.ADMIN,RoleType.SELLER))
    async getAllForSellerByRef(@Query('owner') owner:string){
      return this.produitService.findByOwnerSeller(owner)
    }
    @Get('seller/:id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new RoleInterceptor(RoleType.ADMIN,RoleType.SELLER))
    async getByRefSeller(@Param('id') id:string){
      return this.produitService.findByIdSeller(id)
    }
    //visitor
    @Get('visitor')
    async getAllForGuests(){
      return this.produitService.getForUsers()
    }
    @Get('visitor/owner')
    async getAllForUserByRef(@Query('owner') owner:string){
      try{
        return this.produitService.findByOwnerGuest(owner)
      }catch(err){
        throw new BadRequestException(`${err['message']}`)
      }
    }
    @Get('visitor/item')
    async getItemForUser(@Query('ref') ref:string){
      return this.produitService.getItemForGuest(ref)
    }
    @Get('visitor/:id')
    async getByRefGuest(@Param('id') id:string){
      return this.produitService.findByIdGuest(id)
    }
}