import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
/* import { ValidationPipe } from '@nestjs/common'; */

async function bootstrap() {
  const appOptions = {cors: true};
  const app = await NestFactory.create(ApplicationModule, appOptions);
  /* app.setGlobalPrefix('api'); */
  /* app.useGlobalPipes(new ValidationPipe()); */


  await app.listen(3000);
}
bootstrap();