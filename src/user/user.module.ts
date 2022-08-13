import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthController } from './auth.controller';

import User from '../entities/user.entity';
import { PostService } from '../post/post.service';
import { CommentService } from '../comment/comment.service';
import Posts from '../entities/post.entity';
import Comment from '../entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Posts, Comment])],
  providers: [UserService, PostService, CommentService],
  controllers: [UserController, AuthController],
})
export class UserModule {}
