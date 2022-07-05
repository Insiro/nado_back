import { Injectable } from '@nestjs/common';
import { SignDto, SimpleUserDto } from './auth.dto';

@Injectable()
export class AuthService {
  async signIn(signInfo: SignDto): Promise<SimpleUserDto | null> {
    return null;
  }

  async getUser(uid: string): Promise<SimpleUserDto | null> {
    return null;
  }
}
