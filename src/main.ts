import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import * as session from 'express-session';

import { AppModule } from './app/app.module';
import { SessionOptions } from 'express-session';

const sessionOption: SessionOptions = {
  secret: 'nado123@',
  resave: false,
  saveUninitialized: false,
};

async function main() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(session(sessionOption));
  await app.listen(3000);
  console.log('initialize nado writer server');
}

main().catch((e) => console.log(e));
