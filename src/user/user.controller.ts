import {
  Controller,
  Param,
  Get,
  Post,
  Body,
  Delete,
  Session,
  UnauthorizedException,
  NotFoundException,
  UnprocessableEntityException,
  NotAcceptableException,
} from '@nestjs/common';
import { UserService } from './user.service';

import {
  DetailedUserInfoDto,
  RegisterDto,
  SignDto,
  SimpleUserDto,
  SimpleUserInfoDto,
} from './user.dto';

@Controller('user')
export class UserController {
  constructor(readonly userService: UserService) {}

  @Post('sign')
  async signIn(
    @Body() reqBody: SignDto,
    @Session session: Record<string, any>,
  ): Promise<SimpleUserDto> {
    const user = await this.userService.signIn(reqBody);
    if (user === null) {
      throw new UnauthorizedException();
    }
    session.id = user.uuid;
    session.name = user.user_name;
    return user;
  }

  @Delete()
  signOut(@Session session: Record<string, any>) {
    session.destroy();
  }

  @Post()
  async registerUser(@Body reqBody: RegisterDto) {
    const result = await this.userService.register(reqBody);
    if (!result) throw new NotAcceptableException();
    //TODO: register user
    return;
  }

  @Get(':id')
  async getOne(@Param('id') uid: string): Promise<SimpleUserInfoDto> {
    const user = await this.userService.getOne(uid);
    if (user === null) throw new NotFoundException();
    return user;
  }

  @Post(':id')
  async getDetailedOne(
    @Param('id') uid: string,
    @Body() body,
  ): Promise<DetailedUserInfoDto> {
    if (!('pwd' in body)) throw new UnprocessableEntityException();

    const user = await this.userService.getOne(uid);
    if (user == null) throw new NotFoundException();
    else if (!this.userService.verify(user, body.pwd))
      throw new UnauthorizedException();
    return user;
    //TODO: view all information of user
  }
}
