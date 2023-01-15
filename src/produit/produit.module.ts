import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProduitController } from './produit.controller';
import { produitEntity } from './produit.entity';
import { ProduitService } from './produit.service';

@Module({
  imports: [TypeOrmModule.forFeature([produitEntity])],
  providers: [ProduitService],
  controllers: [ProduitController],
  exports: [ProduitService]
})
 
export class ProduitModule implements NestModule{
  public configure(consumer: MiddlewareConsumer) {
      
  }

}