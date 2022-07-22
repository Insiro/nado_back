import { DataSourceOptions } from 'typeorm';

export const DatabaseConfig: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'nado',
  password: 'nado123@',
  database: 'nado',
  synchronize: false,
  logging: false,
};
