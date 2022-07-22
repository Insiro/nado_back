import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { DatabaseConfig } from './app/database.config';

export const AppDataSource = new DataSource({
  ...DatabaseConfig,
  entities: ['./**/*.entity.ts'],
} as DataSourceOptions);
