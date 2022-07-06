import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';

import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
    console.log('initialize nado writer server');
  } catch (e) {}
}

bootstrap();
