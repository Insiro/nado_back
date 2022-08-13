import { Allow, IsEmail } from 'class-validator';

class CommonUserInfo {
  @Allow()
  user_name: string;
  @IsEmail()
  email: string;
}

export class UserInfoDto extends CommonUserInfo {
  @Allow()
  uid: string;
}

export type DetailedUserInfoDto = UserInfoDto;

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
