import { FindProfileByIdHandler } from './find-profile-by-id.handler';
import { FindProfileByUserIdHandler } from './find-profile-by-user-id.handler';
import { FindUserByEmailHandler } from './find-user-by-email.handler';
import { FindUserByFilterhandler } from './find-user-by-filter.handler';
import { FindUserByIdHandler } from './find-user-by-id.handler';
import { FindUserByPhoneNumberHandler } from './find-user-by-phone-number.handler';
import { GetAllUserHandler } from './get-all-user.handler';

export const UserQueries = [
  FindUserByEmailHandler,
  FindUserByIdHandler,
  FindUserByPhoneNumberHandler,
  FindUserByFilterhandler,
  GetAllUserHandler,
  FindProfileByIdHandler,
  FindProfileByUserIdHandler,
];

export * from './find-user-by-email.query';
export * from './find-user-by-id.query';
export * from './find-user-by-phone-number.query';
export * from './get-all-user.query';
export * from './find-profile-by-id.query';
export * from './find-profile-by-user-id.query';
