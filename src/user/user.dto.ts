export class SimpleUserInfoDto {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

export class DetailedUserInfoDto extends SimpleUserInfoDto {}

export class SignDto {
  readonly id: string;
  readonly pwd: string;
}

export class SimpleUserDto {
  readonly id: string;
  readonly name: string;
}
