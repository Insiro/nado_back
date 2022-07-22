import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from '../post/post.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { CommentModule } from '../comment/comment.module';
import { DatabaseConfig } from './database.config';

const typeormOption = {
  ...DatabaseConfig,
  autoLoadEntities: true,
} as TypeOrmModuleOptions;

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormOption),
    UserModule,
    AuthModule,
    PostModule,
    CommentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
