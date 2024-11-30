import { Injectable } from '@nestjs/common';
import { CommandBus, ICommand } from '@nestjs/cqrs';

import { UserResponse } from '../response/user.reponse';
import { UserUpdate } from '../type/update-payload';
import {
  ChangeEmailCommand,
  ChangeFullnameCommand,
  ChangePasswordCommand,
  ChangePhoneNumberCommand,
  LockAccountCommand,
  UpdateProviderCommand,
  VerifyUserCommand,
} from '../commands';

@Injectable()
export class HandlerService {
  constructor(private readonly commandBus: CommandBus) {}

  async handleUserAction(
    action: string,
    data: UserResponse,
    payload: UserUpdate,
  ): Promise<boolean> {
    let command: ICommand;

    switch (action) {
      case 'changeUsername': {
        command = new ChangeFullnameCommand(data, payload);

        break;
      }
      case 'changeEmail': {
        command = new ChangeEmailCommand(data, payload);

        break;
      }
      case 'changePhonenumber': {
        command = new ChangePhoneNumberCommand(data, payload);

        break;
      }
      case 'changePassword': {
        command = new ChangePasswordCommand(data, payload);

        break;
      }
      case 'verifyUser': {
        command = new VerifyUserCommand(data, payload);

        break;
      }
      case 'lockAccount': {
        command = new LockAccountCommand(data, payload);

        break;
      }
      case 'updateProvider': {
        command = new UpdateProviderCommand(data, payload);

        break;
      }
      default:
        throw new Error('Actions not valid');
    }

    const result: boolean = await this.commandBus.execute(command);

    return result;
  }
}
