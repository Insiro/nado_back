import crypto from 'crypto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionType } from '../utils';

import User from './user.entity';
import { EditableUserInfoDto, SignDto, SimpleUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getOne(uid: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { uuid: uid } });
  }

  verify(user: User, pwd): boolean {
    return user.cert === this.hash(pwd, user.salt);
  }

  hash(pwd: string, salt: string): string {
    return crypto
      .createHash('sha512')
      .update(pwd + salt)
      .digest('hex');
  }

  async register(reqBody: EditableUserInfoDto): Promise<boolean> {
    const salt = Math.round(new Date().valueOf() * Math.random()) + '';
    const hashed_pwd = this.hash(reqBody.pwd, salt);
    const user = { salt: salt, cert: hashed_pwd, ...reqBody };

    const insertQuery = this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(user);
    try {
      await insertQuery.execute();
      return true;
    } catch (e) {
      return false;
    }
  }

  updateSession(session: SessionType, sessionInfo: SimpleUserDto) {
    session.uid = sessionInfo.uuid;
    session.name = sessionInfo.user_name;
    session.save();
  }

  async update(session: SessionType, updateInfo: EditableUserInfoDto) {
    const user = await this.getOne(session.uid);
    if (user === null) throw new NotFoundException();
    if (!this.verify(user, updateInfo.pwd)) throw new UnauthorizedException();

    const updated = await this.userRepository.save({
      uuid: user.uuid,
      ...updateInfo,
    });
    this.updateSession(session, updated);
  }

  async signIn(signInfo: SignDto, session: SessionType): Promise<User> {
    const user = await this.getOne(signInfo.uuid);
    if (user == null) throw new NotFoundException();
    if (!this.verify(user, signInfo.pwd)) throw new UnauthorizedException();
    this.updateSession(session, user);
    return user;
  }
}
