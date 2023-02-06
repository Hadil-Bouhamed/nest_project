import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/shared/schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
/* import { AuthMiddleware } from './auth.middleware'; */

@Module({
  imports: [
    MongooseModule.forFeature([{name:'User',schema:UserSchema}])
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}