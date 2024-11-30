import { FindUserByEmailHandler } from './find-user-by-email.handler';
import { FindUserByIdHandler } from './find-user-by-id.handler';
import { FindUserByPhoneNumberHandler } from './find-user-by-phone-number.handler';
import { GetAllUserHandler } from './get-all-user.handler';

export const UserQueries = [
  FindUserByEmailHandler,
  FindUserByIdHandler,
  FindUserByPhoneNumberHandler,
  GetAllUserHandler,
];

export * from './find-user-by-email.query';
export * from './find-user-by-id.query';
export * from './find-user-by-phone-number.query';
export * from './get-all-user.query';
