import {
  Body,
  Controller,
  Post,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { SignDto, SimpleUserDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Param } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(readonly authService: AuthService) {}

  @Post()
  async signIn(@Body() reqBody: SignDto): Promise<SimpleUserDto> {
    const user = await this.authService.signIn(reqBody);
    if (user === null) {
      throw new UnauthorizedException();
    }
    return user;
  }

  @Get(':id')
  async isAvailableId(@Param('id') uid: string): Promise<boolean> {
    const user = await this.authService.getUser(uid);
    return user !== null;
  }
}
