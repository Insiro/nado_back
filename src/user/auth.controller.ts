import { Body, Controller, Delete, Get, Post, Session } from '@nestjs/common';
import { SessionType } from '../utils';

import { RegisterUserDto, SignDto, UserInfoDto } from './user.dto';
import { UserService } from './user.service';

@Controller('auth')
export class AuthController {
  constructor(readonly service: UserService) {}

  @Get()
  chkSigned(@Session() session: SessionType): boolean {
    return !!session.uid;
  }

  @Post()
  async signIn(
    @Body() reqBody: SignDto,
    @Session() session: SessionType,
  ): Promise<UserInfoDto> {
    const user = await this.service.signIn(reqBody, session);

    return new UserInfoDto().fromUser(user);
  }

  @Delete()
  signOut(@Session() session: SessionType) {
    session.destroy(null);
  }

  @Post('register')
  async registerUser(@Body() reqBody: RegisterUserDto) {
    await this.service.register(reqBody);
  }
}
