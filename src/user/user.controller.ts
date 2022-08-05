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
  SimpleUserInfoDto,
} from './user.dto';

@Controller('user')
export class UserController {
  constructor(readonly userService: UserService) {}

  @Get(':id')
  async getOne(@Param('id') uid: string): Promise<SimpleUserInfoDto> {
    const user = await this.userService.getOne(uid);
    if (user === null) throw new NotFoundException();
    return user;
  }

  @Get()
  async getSigned(@Session() session: SessionType): Promise<SimpleUserInfoDto> {
    if (!session.uid) throw new NotFoundException();
    const user = await this.userService.getOne(session.uid);
    if (user === null) throw new NotFoundException();
    return user;
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
    return user;
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
}
