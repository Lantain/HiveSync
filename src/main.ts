import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(`Starting on ${process.env.PORT}:${process.env.HOST}...`)
  await app.listen(process.env.PORT || 8080);
}
bootstrap();
