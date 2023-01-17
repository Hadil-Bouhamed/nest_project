import { ProduitService } from './produit.service';
import { CreateProduitDto, UpdateProduitDto } from './dto'; 
import { produitEntity } from './entities/produit.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RoleInterceptor } from 'src/auth/interceptors/roles.interceptor';
import { RoleType } from 'src/shared/enums/roleType.enum';
import { UnauthorizedException,NotFoundException } from '@nestjs/common/exceptions';
import { Controller, Get, Param,Query,Post,Body, UseGuards, UseInterceptors, Patch, Put } from '@nestjs/common';
import { MarqueEnum } from './enums/marque.enum';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { UserEntity } from 'src/user/entities/user.entity';
import { AddStockInter } from 'src/shared/interfaces/produit.interface';
 
@Controller('product')
export class ProduitController {
    constructor(private produitService: ProduitService) {}
  
    //sellers
    @Get('seller/item')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new RoleInterceptor(RoleType.ADMIN,RoleType.SELLER))
    async getItemForSeller(@Query('ref') ref:string){
      return this.produitService.getItemForSeller(ref)
    }
    @Post('seller/add')
    //@UseGuards(JwtAuthGuard)
    //@UseInterceptors(new RoleInterceptor(RoleType.ADMIN,RoleType.SELLER))
    async addProd(@GetUser()user :UserEntity,@Body() payload:CreateProduitDto){
      return this.produitService.addProduct(user,payload)
    }
    @Put('seller/addStock')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new RoleInterceptor(RoleType.SELLER,RoleType.ADMIN))
    async addToStock(@GetUser() user:UserEntity,@Body() payload:AddStockInter){
      return this.produitService.addToStock(user,payload)
    }
    @Put('seller/stopProd')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new RoleInterceptor(RoleType.SELLER,RoleType.ADMIN))
    async stopProd(@GetUser() user:UserEntity,@Body() payload:{id:string}){
      return this.produitService.stopProd(user,payload.id)
    }
    @Get('seller/All')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new RoleInterceptor(RoleType.ADMIN,RoleType.SELLER))
    async getAllForSeller(){
      return this.produitService.getForAdmins()
    }
    @Get('seller/All/Grouped')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new RoleInterceptor(RoleType.ADMIN,RoleType.SELLER))
    async getAllForSellerByRef(){
      return this.produitService.allGroupedByRefGuest()
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
    @Get('visitor/Grouped')
    async getAllForUserByRef(){
      return this.produitService.allGroupedByRefGuest()
    }
    @Get('visitor/item')
    async getItemForUser(@Query('ref') ref:string){
      return this.produitService.getItemForGuest(ref)
    }
    @Get('visitor/item/:id')
    async getByRefGuest(@Param('id') id:string){
      return this.produitService.findByIdGuest(id)
    }
}