import { Session } from 'express-session';

export type SessionType = Session & {
  uid?: string;
  name?: string;
};
