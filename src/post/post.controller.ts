import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Session,
} from '@nestjs/common';
import Posts from '../entities/post.entity';
import Comment from '../entities/comment.entity';
import { SessionType } from '../utils';

import { UserService } from '../user/user.service';
import { PostService } from './post.service';
import { CommentService } from '../comment/comment.service';
import { NewPostDto } from './post.dto';

@Controller('post')
export class PostController {
  constructor(
    readonly postService: PostService,
    readonly userService: UserService,
    readonly commentService: CommentService,
  ) {}

  @Get()
  async getPosts(
    @Query('offset') offset: number,
    @Query('count') count: number,
  ): Promise<Posts[]> {
    return await this.postService.getPosts(offset, count);
  }

  @Post()
  async newPost(@Session() session: SessionType, @Body() postOpt: NewPostDto) {
    const user = await this.userService.getById(session.uid);
    await this.postService.newPost(user, postOpt);
  }

  @Get('user/:uid')
  async getUserPost(@Param('uid') uid: string): Promise<Posts[]> {
    return await this.postService.getByAuthor(uid);
  }

  @Get(':id/posts')
  async getSubPosts(@Param('id') postId: string): Promise<Posts[]> {
    return await this.postService.getSubPosts(postId);
  }

  @Get(':id/comment')
  async getComment(@Param('id') postId: string): Promise<Comment[]> {
    return await this.commentService.getByPost(postId);
  }

  @Get(':id')
  async getOne(@Param('id') postId: string): Promise<Posts> {
    return await this.postService.getOne(postId);
  }

  @Post(':id')
  async appendPost(
    @Session() session: SessionType,
    @Param('id') postId: string,
    @Body() postOpt: NewPostDto,
  ) {
    const user = await this.userService.getSigned(session);
    await this.postService.newPost(user, postOpt, postId);
  }

  @Put(':id')
  async rewritePost(
    @Session() session: SessionType,
    @Param('id') postId: string,
    @Body() postOpt: NewPostDto,
  ) {
    const user = await this.userService.getSigned(session);
    await this.postService.updatePost(user, postId, postOpt);
  }

  @Delete(':id')
  async deletePost(
    @Session() session: SessionType,
    @Param('id') postId: string,
  ) {
    const user = await this.userService.getSigned(session);
    await this.postService.deletePost(user, postId);
  }
}
