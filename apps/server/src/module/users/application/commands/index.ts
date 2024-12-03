import { ChangeEmailHandler } from './change-email.handler';
import { ChangeFullnameHandler } from './change-fullname.handler';
import { ChangePasswordHandler } from './change-password.handler';
import { ChangePhoneNumberHandler } from './change-phone-number.handler';
import { CreateUserHandler } from './create-user.handler';
import { LockAccountHandler } from './lock-account.handler';
import { UpdateProviderHandler } from './update-provider.handler';
import { VerifyUserHandler } from './verify-user.handler';

export const UserCommands = [
  CreateUserHandler,
  ChangeEmailHandler,
  ChangeFullnameHandler,
  ChangePasswordHandler,
  ChangePhoneNumberHandler,
  UpdateProviderHandler,
  VerifyUserHandler,
  LockAccountHandler,
];

export * from './change-email.command';
export * from './change-password.command';
export * from './change-fullname.command';
export * from './change-phone-number.command';
export * from './update-provider.command';
export * from './lock-account.command';
export * from './verify-user.command';
export * from './create-user.command';
