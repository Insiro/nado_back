import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Session,
  NotAcceptableException,
} from '@nestjs/common';
import { SessionType } from '../utils';

import { EditableUserInfoDto, SignDto, SimpleUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('auth')
export class AuthController {
  constructor(readonly service: UserService) {}

  @Get()
  chkSigned(@Session() session: SessionType): boolean {
    return !session.uid;
  }

  @Post()
  async signIn(
    @Body() reqBody: SignDto,
    @Session() session: SessionType,
  ): Promise<SimpleUserDto> {
    return await this.service.signIn(reqBody, session);
  }

  @Delete()
  signOut(@Session() session: SessionType) {
    session.destroy(null);
  }

  @Post('register')
  async registerUser(@Body reqBody: EditableUserInfoDto) {
    const result = await this.service.register(reqBody);
    if (!result) throw new NotAcceptableException();
    return;
  }
}
