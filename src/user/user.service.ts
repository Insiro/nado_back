import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import User from './user.entity';
import { Repository } from 'typeorm';
import { SignDto, SimpleUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getOne(uid: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { uuid: uid } });
  }

  async signIn(signInfo: SignDto): Promise<SimpleUserDto | null> {
    return null;
  }

  async getUser(uid: string): Promise<SimpleUserDto | null> {
    return null;
  }
}
