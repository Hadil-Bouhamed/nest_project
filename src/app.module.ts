import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FournisseurModule } from './fournisseur/fournisseur.module';
import { ProduitModule } from './produit/produit.module';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'my_nestproject_data',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    UserModule,
    FournisseurModule,
    ProduitModule,
  ],
  controllers: [
    AppController
  ],
  providers: []
})
export class ApplicationModule {

}