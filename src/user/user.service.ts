import crypto from 'crypto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SessionType } from '../utils';

import User from '../entities/user.entity';
import {
  EditableUserInfoDto,
  RegisterUserInfoDto,
  SignDto,
  SimpleUserDto,
} from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getOne(uid: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { uid: uid } });
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

  make_cert(pwd: string): { salt: string; cert: string } {
    const salt = Math.round(new Date().valueOf() * Math.random()) + '';
    const hashed_pwd = this.hash(pwd, salt);
    return { salt: salt, cert: hashed_pwd };
  }

  async register(reqBody: RegisterUserInfoDto) {
    if ((await this.getOne(reqBody.uid)) !== null)
      throw new ConflictException();
    const hashed = this.make_cert(reqBody.pwd);
    const user = { ...hashed, ...reqBody };

    const insertQuery = this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(user);
    try {
      await insertQuery.execute();
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }

  updateSession(session: SessionType, sessionInfo: SimpleUserDto) {
    session.uid = sessionInfo.uid;
    session.name = sessionInfo.user_name;
    session.save();
  }

  async getById(uid?: string): Promise<User> {
    if (!uid) throw new NotFoundException();
    const user = await this.getOne(uid);
    if (!user) throw new NotFoundException();
    return user;
  }

  async update(session: SessionType, updateInfo: EditableUserInfoDto) {
    let user: User;
    try {
      user = await this.getById(session.uid);
    } catch (_) {
      throw new UnauthorizedException();
    }
    if (!this.verify(user, updateInfo.pwd)) throw new UnauthorizedException();
    const updated = await this.userRepository.save({
      uuid: user.uid,
      ...updateInfo,
    });
    this.updateSession(session, updated);
  }

  async signIn(signInfo: SignDto, session: SessionType): Promise<User> {
    const user = await this.getById(session.uid);
    if (!this.verify(user, signInfo.pwd)) throw new UnauthorizedException();
    this.updateSession(session, user);
    return user;
  }
}
