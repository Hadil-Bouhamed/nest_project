import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, getRepository } from 'typeorm';
import { produitEntity } from './produit.entity';
import {CreateProduitDto, UpdateProduitDto} from './dto';
const jwt = require('jsonwebtoken');
import { SECRET } from '../config';
import { validate } from 'class-validator';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';
import { ProduitRO } from './produit.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(produitEntity)
    private readonly userRepository: Repository<produitEntity>
  ) {}

  async findAll(): Promise<produitEntity[]> {
    return await this.userRepository.find();
  }

  async findOne({reference , marque}: CreateProduitDto): Promise<produitEntity> {
     const produit = await this.userRepository.findOne( { where:
        { reference : reference , marque : marque}
    });
    if (!produit) {
      return null;
    }

    return produit;
  }

  async create(dto: CreateProduitDto): Promise<ProduitRO> {

    // check uniqueness of product
    const {reference, marque, couleur , taille_monture , prix} = dto;
    const qb = await getRepository(produitEntity)
      .createQueryBuilder('produit')
      .where('produit.reference = :reference', { reference })
      .where('produit.marque = :marque', { marque }); 

    const produit = await qb.getOne();

    if (produit) {
      const errors = {reference: 'product must be unique.'};
      throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);

    }

    // create new user
    let newProduit = new produitEntity();
    newProduit.reference = reference;
    newProduit.marque = marque;
    newProduit.couleur = couleur;
    newProduit.taille_monture = taille_monture;
    newProduit.prix = prix;


    const errors = await validate(newProduit);
    if (errors.length > 0) {
      const _errors = {reference: 'Produitinput is not valid.'};
      throw new HttpException({message: 'Input data validation failed', _errors}, HttpStatus.BAD_REQUEST);

    } else {
      const savedProduit= await this.userRepository.save(newProduit);
      return this.buildUserRO(savedProduit);
    }

  }

  async update(reference: string, marque : string , dto: UpdateProduitDto): Promise<produitEntity> {
    const { couleur , taille_monture , prix} = dto;
    let toUpdate = await this.userRepository.findOne( { where: 
        {reference : reference , marque : marque }
    });
    
    let updatedProduit = Object.assign(toUpdate, dto); 
    return await this.userRepository.save(updatedProduit); 
   
  }

  async delete(reference: string , marque : string): Promise<DeleteResult> {
    return await this.userRepository.delete({ reference : reference , marque : marque});
  }

   async findById(id: number): Promise<ProduitRO>{
     const produit = await this.userRepository.findOne( { where:
        { id: id}
    });

    if (!produit) {
      const errors = {produit: ' not found'};
      throw new HttpException({errors}, 401);
    }

    return this.buildUserRO(produit); 
    
  } 


  public generateJWT(produit) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
      id: produit.id,
      reference : produit.reference,
      marque : produit.marque,
      exp: exp.getTime() / 1000,
    }, SECRET);
  };

  private buildUserRO(produit: produitEntity) {
    const ProduitRO = {
        id: produit.id,
        reference : produit.reference,
        marque : produit.marque,
      token: this.generateJWT(produit),
    };

    return {produit : ProduitRO};
  }
}