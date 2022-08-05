import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Session,
} from '@nestjs/common';
import Posts from '../entities/post.entity';
import { PostService } from './post.service';
import { NewPostDto } from './post.dto';
import { SessionType } from '../utils';
import { UserService } from '../user/user.service';

@Controller('post')
export class PostController {
  constructor(
    readonly postService: PostService,
    readonly userService: UserService,
  ) {}

  @Get()
  async getPosts(
    @Query('offset') offset: number,
    @Query('count') count: number,
  ): Promise<Posts[]> {
    return await this.postService.getPosts(offset, count);
  }

  @Get(':id/posts')
  async getSubPosts(@Param('id') postId: string): Promise<Posts[]> {
    return await this.postService.getSubPosts(postId);
  }

  @Get(':id')
  async getOne(@Param('id') postId: string): Promise<Posts> {
    return await this.postService.getOne(postId);
  }

  @Post()
  async newPost(@Session() session: SessionType, @Body() postOpt: NewPostDto) {
    const user = await this.userService.getById(session.uid);
    await this.postService.newPost(user, postOpt);
  }

  @Post(':id')
  async appendPost(
    @Session() session: SessionType,
    @Param('id') postId: string,
    @Body() postOpt: NewPostDto,
  ) {
    const user = await this.userService.getById(session.uid);
    await this.postService.newPost(user, postOpt, postId);
  }

  @Put('id')
  async rewritePost(
    @Session() session: SessionType,
    @Param('id') postId: string,
    @Body() postOpt: NewPostDto,
  ) {
    const user = await this.userService.getById(session.uid);
    await this.postService.updatePost(user, postId, postOpt);
  }
}
