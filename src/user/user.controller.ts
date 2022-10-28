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
import { validate } from 'class-validator';

@Controller('user')
export class UserController {
  constructor(readonly userService: UserService) {}

  @Get()
  async getSigned(@Session() session: SessionType): Promise<UserInfoDto> {
    if (!session.uid) throw new NotFoundException();
    const user = await this.userService.getById(session.uid);
    if (user === null) throw new NotFoundException();
    const dto = new UserInfoDto().fromUser(user);
    return dto;
  }

  @Post()
  async getDetailedOne(
    @Session() session: SessionType,
    @Body() body,
  ): Promise<DetailedUserInfoDto> {
    if (!('pwd' in body)) throw new UnprocessableEntityException();
    if (!session.uid) throw new UnauthorizedException();
    const user = await this.userService.getOne(session.uid);
    if (user == null || !this.userService.verify(user, body.pwd))
      throw new UnauthorizedException();
    return new DetailedUserInfoDto().fromUser(user);
  }

  @Put()
  async updateUserInfo(
    @Session() session: SessionType,
    @Body() body: EditableUserInfoDto,
  ) {
    if (!session.uid) throw new UnauthorizedException();
    await this.userService.update(session, body);
    return 'success';
  }

  @Get(':id')
  async getOne(@Param('id') uid: string): Promise<UserInfoDto> {
    const user = await this.userService.getOne(uid);
    if (user === null) throw new NotFoundException();
    return new UserInfoDto().fromUser(user);
  }
}
