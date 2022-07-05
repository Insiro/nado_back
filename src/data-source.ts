import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'nado',
  password: 'nado123@',
  database: 'nado',
  synchronize: true,
  logging: false,
  entities: ['./entity/*.ts', './entity/*.js'],
  migrations: [],
  subscribers: [],
});
