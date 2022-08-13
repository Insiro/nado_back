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

import Comment from '../entities/comment.entity';

@Controller('comment')
export class CommentController {
  constructor(
    readonly commentService: CommentService,
    readonly userService: UserService,
  ) {}

  @Get('id')
  async getComment(@Param('id') commentId: string): Promise<Comment> {
    return await this.commentService.getOne(commentId);
  }

  @Put('id')
  async fixComment(
    @Session() session: SessionType,
    @Param('id') commentId: string,
    @Body() commentOpt: EditableCommentDto,
  ) {
    const user = await this.userService.getSigned(session);
    await this.commentService.updateComment(user, commentId, commentOpt);
  }

  @Post('id')
  async appendComment(
    @Session() session: SessionType,
    @Param('id') commentId: string,
    @Body() commentOpt: EditableCommentDto,
  ) {
    const user = await this.userService.getSigned(session);
    await this.commentService.addComment(user, commentOpt, {
      parent: commentId,
    });
  }

  @Delete('id')
  async deleteComment(
    @Session() session: SessionType,
    @Param('id') commentId: string,
  ) {
    const user = await this.userService.getSigned(session);
    await this.commentService.deleteComment(user, commentId);
  }
}
