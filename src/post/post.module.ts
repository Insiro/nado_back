import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UserService } from '../user/user.service';

import User from '../entities/user.entity';
import Posts from '../entities/post.entity';
import { CommentService } from '../comment/comment.service';
import Comment from '../entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, User, Comment])],
  controllers: [PostController],
  providers: [PostService, UserService, CommentService],
})
export class PostModule {}
