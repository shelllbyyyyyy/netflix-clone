import { UserResponse } from '../response/user.reponse';
import { UserUpdate } from '../type/update-payload';

export class ChangePasswordCommand {
  constructor(
    public data: UserResponse,
    public payload: UserUpdate,
  ) {}
}