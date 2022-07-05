import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

const typeormOption: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'nado',
  password: 'nado123@',
  database: 'nado',
  synchronize: true,
  logging: false,
  autoLoadEntities: true,
};

@Module({
  imports: [TypeOrmModule.forRoot(typeormOption), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
