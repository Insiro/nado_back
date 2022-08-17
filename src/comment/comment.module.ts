import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Comment from '../entities/comment.entity';
import { UserService } from '../user/user.service';
import { PostService } from '../post/post.service';
import Posts from '../entities/post.entity';
import User from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Posts, User])],
  providers: [CommentService, UserService, PostService],
  controllers: [CommentController],
})
export class CommentModule {}
