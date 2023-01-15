import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProduitController } from './produit.controller';
import { produitEntity } from './produit.entity';
import {Produitservice } from './produit.service';
import { ProduitService } from './produit.service';

@Module({
  imports: [TypeOrmModule.forFeature([produitEntity])],
  controllers: [ProduitController],
  providers: [ProduitService],
  exports: [ProduitService]
})
export class ProduitModule {}
