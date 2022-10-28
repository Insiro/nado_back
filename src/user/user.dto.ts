import { Allow, IsEmail } from 'class-validator';
import User from 'src/entities/user.entity';

class CommonUserInfo {
  @Allow()
  user_name: string;
  @IsEmail()
  email: string;
  fromUser(user: User) {
    this.user_name = user.user_name;
    this.email = user.email;
    return this;
  }
}

export class UserInfoDto extends CommonUserInfo {
  @Allow()
  uid: string;
  fromUser(user: User) {
    super.fromUser(user);
    this.uid = user.uid;
    return this;
  }
}

export class DetailedUserInfoDto extends UserInfoDto {}

export class RegisterUserDto extends UserInfoDto {
  @Allow()
  pwd: string;
}

export class EditableUserInfoDto extends CommonUserInfo {
  @Allow()
  readonly pwd: string;
}

export class SignDto {
  @Allow()
  readonly uid: string;
  @Allow()
  readonly pwd: string;
}
