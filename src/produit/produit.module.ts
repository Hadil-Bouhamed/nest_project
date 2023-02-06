import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProduitController } from './produit.controller';
import { ProduitService } from './produit.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from 'src/shared/schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name:'Product',schema:ProductSchema}]),
  ],
  providers: [ProduitService],
  controllers: [ProduitController],
  exports: [ProduitService]
})
 
export class ProduitModule implements NestModule{
  public configure(consumer: MiddlewareConsumer) {
      
  }

}