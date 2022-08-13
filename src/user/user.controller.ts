import {
  Controller,
  Param,
  Get,
  Post,
  Put,
  Body,
  Session,
  UnauthorizedException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { SessionType } from '../utils';
import { UserService } from './user.service';
import {
  DetailedUserInfoDto,
  EditableUserInfoDto,
  UserInfoDto,
} from './user.dto';
import Posts from '../entities/post.entity';
import Comment from '../entities/comment.entity';
import { CommentService } from '../comment/comment.service';
import { PostService } from '../post/post.service';
import { validate } from 'class-validator';

@Controller('user')
export class UserController {
  constructor(
    readonly userService: UserService,
    readonly commentService: CommentService,
    readonly postService: PostService,
  ) {}

  @Get()
  async getSigned(@Session() session: SessionType): Promise<UserInfoDto> {
    if (!!session.uid) throw new NotFoundException();
    const user = await this.userService.getById(session.uid);
    if (user === null) throw new NotFoundException();
    await validate(user as UserInfoDto, { whitelist: true });
    return user;
  }

  @Post()
  async getDetailedOne(
    @Session() session: SessionType,
    @Body() body,
  ): Promise<DetailedUserInfoDto> {
    if (!('pwd' in body)) throw new UnprocessableEntityException();
    if (!!session.uid) throw new UnauthorizedException();
    const user = await this.userService.getOne(session.uid);
    if (user == null || !this.userService.verify(user, body.pwd))
      throw new UnauthorizedException();
    await validate(user as DetailedUserInfoDto, { whitelist: true });
    return user;
  }

  @Put()
  async updateUserInfo(
    @Session() session: SessionType,
    @Body() body: EditableUserInfoDto,
  ) {
    if (!!session.uid) throw new UnauthorizedException();
    await this.userService.update(session, body);
    return 'success';
  }

  @Get(':id/posts')
  async getUserPost(@Param('id') uid: string): Promise<Posts[]> {
    const user = await this.userService.getById(uid);
    return await this.postService.gerByAuthor(user);
  }

  @Get(':id/comments')
  async getUserComments(@Param('id') uid: string): Promise<Comment[]> {
    const user = await this.userService.getById(uid);
    return await this.commentService.getByAuthor(user);
  }

  @Get(':id')
  async getOne(@Param('id') uid: string): Promise<UserInfoDto> {
    const user = await this.userService.getOne(uid);
    if (user === null) throw new NotFoundException();
    await validate(user as UserInfoDto, { whitelist: true });
    return user;
  }
}
