import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Session,
} from '@nestjs/common';

import { SessionType } from '../utils';

import { CommentService } from './comment.service';
import { UserService } from '../user/user.service';
import { EditableCommentDto } from './comment.dto';
import { PostService } from 'src/post/post.service';

import Comment from '../entities/comment.entity';

@Controller('comment')
export class CommentController {
  constructor(
    readonly commentService: CommentService,
    readonly userService: UserService,
    readonly postService: PostService,
  ) {}
  @Get('post/:postId')
  async getCommnentsOfPost(
    @Param('postId') postId: string,
  ): Promise<Comment[]> {
    return await this.commentService.getByPost(postId);
  }

  @Post('post/:postId')
  async newComment(
    @Session() session: SessionType,
    @Param('postId') postId: string,
    @Body() commentOpt: EditableCommentDto,
  ) {
    const user = await this.userService.getSigned(session);
    const post = await this.postService.getOne(postId);
    this.commentService.addComment(user.uid, commentOpt, {
      post: post,
    });
    return;
  }

  @Get('user/:uid')
  async getCommentsByUid(@Param('uid') uid: string): Promise<Comment[]> {
    return await this.commentService.getByAuthor(uid);
  }

  @Get(':id')
  async getComment(@Param('id') commentId: string): Promise<Comment> {
    return await this.commentService.getOne(commentId);
  }

  @Put(':id')
  async fixComment(
    @Session() session: SessionType,
    @Param('id') commentId: string,
    @Body() commentOpt: EditableCommentDto,
  ) {
    await this.commentService.updateComment(session.uid, commentId, commentOpt);
  }

  @Post(':id')
  async appendComment(
    @Session() session: SessionType,
    @Param('id') commentId: string,
    @Body() commentOpt: EditableCommentDto,
  ) {
    const user = await this.userService.getSigned(session);
    await this.commentService.addComment(user.uid, commentOpt, {
      parent: commentId,
    });
  }

  @Delete(':id')
  async deleteComment(
    @Session() session: SessionType,
    @Param('id') commentId: string,
  ) {
    const user = await this.userService.getSigned(session);
    await this.commentService.deleteComment(user.uid, commentId);
  }
}
