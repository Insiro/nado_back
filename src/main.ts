import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import * as session from 'express-session';

import { AppModule } from './app/app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.use(
      session({ secret: 'nado123@', resave: false, saveUninitialized: false }),
    );
    await app.listen(3000);
    console.log('initialize nado writer server');
  } catch (e) {}
}

bootstrap();
