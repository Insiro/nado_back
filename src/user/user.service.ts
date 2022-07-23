import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import User from './user.entity';
import { Repository } from 'typeorm';
import { RegisterDto, SignDto, SimpleUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getOne(uid: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { uuid: uid } });
  }

  verify(user: User, pwd): boolean {
    //TODO: verify user pwd
    return false;
  }

  async register(reqBody: RegisterDto): Promise<boolean> {
    //TODO: register user

    return false;
  }
}
