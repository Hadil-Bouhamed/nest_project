import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, getRepository } from 'typeorm';
import { produitEntity } from './entities/produit.entity';
import {CreateProduitDto, UpdateProduitDto} from './dto';
const jwt = require('jsonwebtoken');
import { validate } from 'class-validator';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus,NotFoundException } from '@nestjs/common';
import { AddStockInter, NegotiatePourcentageInter, ProductForGuests, ProductForSeller } from '../shared/interfaces/produit.interface';
import { EtatProd, SupportProd } from 'src/shared/enums/availability.enum';
import { MarqueEnum } from './enums/marque.enum';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class ProduitService {
  constructor(
    @InjectRepository(produitEntity)
    private readonly produitRepository: Repository<produitEntity>
  ) {}
  
  //all 
  async getForAdmins(): Promise<ProductForSeller[]> {
    return await (await this.produitRepository.find()).map(
      (prod)=>{
        return this.mapSeller(prod)
      }
    );
  }
  async getForUsers():Promise<ProductForGuests[]>{
    return await (await this.produitRepository.find()).map(
      (prod)=>{
        return this.mapGuest(prod)
      }
    )
  }
  //grouped
  async allGroupedByRefGuest():Promise<any|ProductForGuests[][]>{
    try{
      let tmp = await this.produitRepository.createQueryBuilder('produit').groupBy('produit.refProduit').getMany()
      return tmp
    }catch(err){
      console.log(err)
      return 0
    }
  }
  //single item,reference unique not refProduit
  async getItemForGuest(reference: string): Promise<ProductForGuests> {
    if(!reference ){
      throw new ForbiddenException('No bad queries hacker!')
    }
    const produit = await this.produitRepository.findOne( { where:
     { reference : reference}
    });
    if (!produit) {
        throw new NotFoundException('Produit non trouvé!')
    }
    return this.mapGuest(produit);
    }

  async getItemForSeller(reference: string): Promise<ProductForGuests> {
      if(!reference ){
        throw new ForbiddenException('No bad queries hacker!')
      }
      const produit = await this.produitRepository.findOne( { where:
       { reference : reference}
      });
      if (!produit) {
          throw new NotFoundException('Produit non trouvé!')
      }
      return this.mapGuest(produit);
  }

  //get item by refProduct
  async getByRefGuest(ref:string):Promise<ProductForGuests[]>{
    let prods = await this.produitRepository.find({where:{
      refProduit:ref
    }})
    return prods.map((prod)=>{
      return this.mapGuest(prod)
    })
  }

  //by id
  async findByIdGuest(id: string): Promise<ProductForGuests>{
     const produit = await this.produitRepository.findOne( { where:
        { id: id}
    });

    if (!produit) {
      throw new ForbiddenException('No product matches this id!!')
    }

    return this.mapGuest(produit); 
    
  } 
  async findByIdSeller(id: string): Promise<ProductForSeller>{
    const produit = await this.produitRepository.findOne( { where:
       { id: id}
   });

   if (!produit) {
     throw new ForbiddenException('No product matches this id!!')
   }

   return this.mapSeller(produit); 
   
  } 

  //create
  async addProduct(user:UserEntity,payload:CreateProduitDto):Promise<produitEntity>{
    let tmp = await this.produitRepository.find({where:{
      reference:payload.reference
    }})
    if(tmp){
      throw new ForbiddenException('This Product already exists!')
    }
    let newProduct = await this.produitRepository.create({
      reference:payload.reference,
      refProduit:payload.refProduct,
      marque:payload.marque,
      couleur:payload.couleur,
      taille_monture:payload.taille_monture,
      prix:payload.prix,
      prixReel:payload.prixReel,
      stock_amount:payload.stock_amount,
      shoped:payload.stock_amount*payload.prixReel
    })
    newProduct.owner=user
    return await this.produitRepository.save(newProduct)
  }
  //UPDATE
  async negotiateAdmin(payload:NegotiatePourcentageInter){
    //khaleha
  }
  async stopProd(user:UserEntity,id:string):Promise<any>{
    let tmp = await this.produitRepository.findOneBy({id})
    if(tmp){
      if(user.username != tmp.owner.username){
        throw new ForbiddenException('Not your product dear sir')
      }
      let newObj = await this.produitRepository.preload({
        ...tmp,
        support:SupportProd.STOP
      })
      return await this.produitRepository.save(newObj)
    }
    throw new NotFoundException('Product Not Found')
  }

  async addToStock(user:UserEntity,payload:AddStockInter):Promise<any>{
    let tmp:produitEntity
    if(payload.ref){
      tmp = await this.produitRepository.findOneBy({refProduit:payload.ref})
    }else if(payload.id){
      tmp = await this.produitRepository.findOneBy({id:payload.id})
    }else{
      throw new ForbiddenException('No empty search sir !')
    }
    if(!tmp){
      throw new NotFoundException('Not Found Product')
    }
    if(tmp.owner.username != user.username){
      throw new ForbiddenException('Not your product sir')
    }
    let newProd:produitEntity=await this.produitRepository.preload({
      ...tmp,
      stock_amount:tmp.stock_amount+payload.amount,
      shoped:payload.amount*payload.prixReel+tmp.shoped
    })
    return await this.produitRepository.save(newProd)
    /* Update lena zeda */
  }
  mapGuest(prod:produitEntity){
    if(!prod){
      throw new NotFoundException('Empty')
    }
    let newProd:ProductForGuests = {
      reference:prod.reference,
      marque:prod.marque,
      couleur:prod.couleur,
      taille:prod.taille_monture,
      prix:prod.prix
    }
    if(prod.stock_amount==1){
      newProd.availability=EtatProd.Lucky
    }else if(prod.stock_amount>1){
      if(prod.stock_amount<5){
        newProd.availability = `Still only ${prod.stock_amount}`
      }else{
        newProd.availability = EtatProd.En_Stock
      }
    }else{
      if(prod.support==SupportProd.CONTINUE){
        newProd.availability = EtatProd.Waiting
      }else{
        newProd.availability = EtatProd.Not_available
      }
    }
    return newProd
  }
  mapSeller(prod:produitEntity){
    if(!prod){
      throw new NotFoundException('Empty')
    }
    let newProd:ProductForSeller= {
      reference:prod.reference,
      marque:prod.marque,
      couleur:prod.couleur,
      taille:prod.taille_monture,
      prix:prod.prix,
      stock:prod.stock_amount,
      status:prod.support,
      achete:prod.shoped,
      vendu:prod.solded,
      prixReel:prod.prixReel,
      taxAdminUnite:0,
      profitUnite:0
    }
    let tmp = prod.pourcentage_admin * prod.prix
    newProd.taxAdminUnite = tmp
    tmp +=prod.prixReel
    tmp = prod.prix - tmp
    newProd.profitUnite = tmp
    return newProd
  }
}