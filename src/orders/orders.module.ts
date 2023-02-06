import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProduitModule } from 'src/produit/produit.module';
import { OrderSchema } from 'src/shared/schemas/order.schema';
import { OrderService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ProduitService } from 'src/produit/produit.service';
@Module({
    imports:[
        UserModule,
        ProduitModule,
        MongooseModule.forFeature([{name:'Order',schema:OrderSchema}])
    ],
    providers:[OrderService],
    controllers:[OrdersController],
    exports:[OrderService]
})
export class OrdersModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
      
    }
}
