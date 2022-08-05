import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { DatabaseConfig } from './app/database.config';

export const AppDataSource = new DataSource({
  ...DatabaseConfig,
  entities: ['./entities/*.entity.ts', './entities/*.entity.js'],
} as DataSourceOptions);
