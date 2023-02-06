import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import {CreateProduitDto, UpdateProduitDto} from './dto';
const jwt = require('jsonwebtoken');
import { validate } from 'class-validator';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus,NotFoundException } from '@nestjs/common';
import { AddStockInter, NegotiatePourcentageInter, ProductForGuests, ProductForSeller } from '../shared/interfaces/produit.interface';
import { EtatProd, SupportProd } from 'src/shared/enums/availability.enum';
import { MarqueEnum } from './enums/marque.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/shared/types/product';
import { User } from 'src/shared/types/user';
import { RoleType } from 'src/shared/enums/roleType.enum';
import { TailleEnum } from './enums/taille.enum';
import { ColorsEnum } from './enums/colors.enum';
import { CreateOrderDTO } from 'src/orders/dto/order.dto';

@Injectable()
export class ProduitService {
  constructor(
    @InjectModel('Product')
    private readonly produitRepository: Model<Product>
  ) {}
  
  //all 
  async getForAdmins(): Promise<ProductForSeller[]> {
    return await (await this.produitRepository.find().populate('owner')).map(
      (prod)=>{
        return this.mapSeller(prod['_doc'])
      }
    );
  }
  async getForUsers():Promise<ProductForGuests[]>{
    return await (await this.produitRepository.find().populate('owner')).map(
      (prod)=>{
        return this.mapGuest(prod)
      }
    )
  }
  //single item,reference unique not refProduit
  async getItemForGuest(reference: string): Promise<ProductForGuests> {
    if(!reference ){
      throw new ForbiddenException('No bad queries hacker!')
    }
    const produit = await this.produitRepository.findOne( { where:
     { reference : reference}
    }).populate('owner');
    if (!produit) {
        throw new NotFoundException('Produit non trouvé!')
    }
    return this.mapGuest(produit);
    }

  async getItemForSeller(reference: string): Promise<ProductForSeller> {
      if(!reference ){
        throw new ForbiddenException('No bad queries hacker!')
      }
      const produit = await this.produitRepository.findOne( { where:
       { reference : reference}
      }).populate('owner');
      if (!produit) {
          throw new NotFoundException('Produit non trouvé!')
      }
      return this.mapSeller(produit);
  }

  async findByOwnerSeller(userId: string): Promise<ProductForSeller[]> {
    return await (await this.produitRepository.find({ owner: userId }).populate('owner')).map(
      (el)=>{
        return this.mapSeller(el)
      }
    );
  }
  async findByOwnerGuest(userId: string): Promise<ProductForGuests[]> {
    return await (await this.produitRepository.find({ owner: userId }).populate('owner')).map(
      (el)=>{
        return this.mapGuest(el)
      }
    );
  }
  //get item by refProduct
  async getByRefGuest(ref:string):Promise<ProductForGuests[]>{
    let prods = await this.produitRepository.find({where:{
      categorie:ref
    }}).populate('owner')
    return prods.map((prod)=>{
      return this.mapGuest(prod)
    })
  }

  //by id
  async findByIdGuest(id: string): Promise<ProductForGuests>{
     const produit = await this.produitRepository.findOne( { where:
        { id: id}
    }).populate('owner');

    if (!produit) {
      throw new ForbiddenException('No product matches this id!!')
    }

    return this.mapGuest(produit); 
    
  } 
  async findByIdSeller(id: string): Promise<ProductForSeller>{
    const produit = await this.produitRepository.findOne( { where:
       { id: id}
   }).populate('owner');

   if (!produit) {
     throw new ForbiddenException('No product matches this id!!')
   }

   return this.mapSeller(produit); 
   
  } 

  //create
  async addProduct(user:any,payload:Partial<CreateProduitDto>):Promise<Product>{
    let tmp = await this.produitRepository.findOne({reference:payload.reference})
    if(tmp){
      throw new ForbiddenException('This Product already exists!')
    }
    let taille = TailleEnum.taille1
    if(payload.taille_monture){
      taille = payload.taille_monture
    }
    let colors = ColorsEnum.Red
    if(payload.couleur){
      colors = payload.couleur
    }
    if(!user){
      throw new BadRequestException('No owner ?')
    }
    let newProduct = await this.produitRepository.create({
      reference:payload.reference,
      categorie:payload.categorie,
      marque:payload.marque,
      couleur:colors,
      taille_monture:taille,
      prix:payload.prix,
      prixReel:payload.prixReel,
      stock_amount:payload.stock_amount,
      shoped:payload.stock_amount*payload.prixReel,
      owner:user
    })
    await newProduct.save();
    return  newProduct
  }
  //UPDATE
  async negotiateAdmin(payload:NegotiatePourcentageInter){
    //khaleha
  }
  async stopProd(user:string,id:string):Promise<Product>{
    let tmp = await this.produitRepository.findById(id)
    if(tmp){
      if(user != tmp.owner.toString()){
        throw new ForbiddenException('Not your product dear sir')
      }
      let newObj ={
        ...tmp,
        support:SupportProd.STOP
      }
      return await tmp.updateOne(newObj)
    }
    throw new NotFoundException('Product Not Found')
  }
  async acheteEl(id:string,amount:number):Promise<Product>{
    let tmp = await this.produitRepository.findById(id).populate('owner')
    if(!tmp){
      throw new NotFoundException('Prod Not Found')
    }
    if(tmp.stock_amount<amount){
      throw new BadRequestException('Out of stock')
    }
    let newProd={
      ...tmp,
      stock_amount:tmp.stock_amount-amount,
      solded:tmp.solded+amount
    }
    return await tmp.updateOne(newProd)
  }

  async addToStock(user:string,payload:AddStockInter):Promise<Product>{
    let tmp:Product
    if(payload.ref){
      tmp = await this.produitRepository.findOne({reference:payload.ref})
    }else if(payload.id){
      tmp = await this.produitRepository.findOne({id:payload.id})
    }else{
      throw new ForbiddenException('No empty search sir !')
    }
    if(!tmp){
      throw new NotFoundException('Not Found Product')
    }
    if(tmp.owner.toString() != user){
      throw new ForbiddenException('Not your product sir')
    }
    let newProd={
      ...tmp,
      stock_amount:tmp.stock_amount+payload.amount,
      shoped:payload.amount*payload.prixReel+tmp.shoped
    }
    return tmp.updateOne(newProd)
    /* Update lena zeda */
  }
  async deleteProduct(id:string,user:string):Promise<Product>{
    const product = await this.produitRepository.findById(id);
    if (user !== product.owner.toString()) {
      throw new HttpException('You do not own this product', HttpStatus.UNAUTHORIZED);
    }
    await product.remove();
    return product.populate('owner');
  }

  mapGuest(prod:any){
    if(!prod){
      throw new NotFoundException('Empty')
    }
    let newProd:ProductForGuests = {
      _id:prod._id,
      reference:prod.reference,
      categorie:prod.categorie,
      marque:prod.marque,
      couleur:prod.couleur,
      taille:prod.taille,
      prix:prod.prix,
      owner:{
        _id:prod.owner._id,
        username:prod.owner.username
      }
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
  mapSeller(prod:any){
    if(!prod){
      throw new NotFoundException('Empty')
    }
    let newProd:ProductForSeller= {
      _id:prod._id,
      reference:prod.reference,
      categorie:prod.categorie,
      marque:prod.marque,
      couleur:prod.couleur,
      taille:prod.taille,
      prix:prod.prix,
      stock:prod.stock_amount,
      status:prod.support,
      achete:prod.shoped,
      vendu:prod.solded,
      prixReel:prod.prixReel,
      taxAdminUnite:0,
      profitUnite:0,
      owner:prod.owner
    }
    let tmp = prod.pourcentage_admin * prod.prix
    newProd.taxAdminUnite = tmp
    tmp +=prod.prixReel
    tmp = prod.prix - tmp
    newProd.profitUnite = tmp
    return newProd
  }
}