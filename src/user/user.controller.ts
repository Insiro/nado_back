import {
  Controller,
  Param,
  Get,
  NotFoundException,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';

import {
  DetailedUserInfoDto,
  SignDto,
  SimpleUserDto,
  SimpleUserInfoDto,
} from './user.dto';

@Controller('user')
export class UserController {
  constructor(readonly userService: UserService) {}

  @Post(':sign')
  async signIn(@Body() reqBody: SignDto): Promise<SimpleUserDto> {
    const user = await this.userService.signIn(reqBody);
    if (user === null) {
      throw new UnauthorizedException();
    }
    return user;
  }

  @Get(':id')
  async getOne(@Param('id') uid: string): Promise<SimpleUserInfoDto> {
    const user = await this.userService.getOne(uid);
    if (user === null) throw new NotFoundException();
    return user as SimpleUserInfoDto;
  }

  @Post(':id')
  async getDetailedOne(
    @Param('id') uid: string,
    @Body() body,
  ): Promise<DetailedUserInfoDto> {
    if ('pwd' in body) {
      //TODO: view all information of user
    } else {
    }
  }
}
