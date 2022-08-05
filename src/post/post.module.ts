import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UserService } from '../user/user.service';

import User from '../entities/user.entity';
import Posts from '../entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, User])],
  controllers: [PostController],
  providers: [PostService, UserService],
})
export class PostModule {}
