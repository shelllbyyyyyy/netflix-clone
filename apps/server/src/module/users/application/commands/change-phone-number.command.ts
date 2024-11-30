import { UserResponse } from '../response/user.reponse';
import { UserUpdate } from '../type/update-payload';

export class ChangePhoneNumberCommand {
  constructor(
    public data: UserResponse,
    public payload: UserUpdate,
  ) {}
}
