import { Session } from 'express-session';

export class SessionType extends Session {
  uid?: string;
  name?: string;
}
