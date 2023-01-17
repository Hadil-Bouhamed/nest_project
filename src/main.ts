import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import * as dotenv from 'dotenv';
async function bootstrap() {
  dotenv.config()
  const appOptions = {cors: true};
  const app = await NestFactory.create(ApplicationModule, appOptions);
  app.useGlobalPipes(new ValidationPipe({
    transform:true,
    whitelist:true,
    forbidUnknownValues:true,
    
  }))
  app.enableCors();
  await app.listen( parseInt(process.env.APP_PORT) || 5000);
}
bootstrap();