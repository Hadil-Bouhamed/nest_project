import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { ProduitModule } from './produit/produit.module';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders/orders.controller';
import { OrderService } from './orders/orders.service';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRoot(
      process.env.MONGO_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
      }
    ),
    UserModule,
    ProduitModule,
    AuthModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class ApplicationModule {

}