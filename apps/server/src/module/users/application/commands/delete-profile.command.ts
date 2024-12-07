import { ProfileResponse } from '../response/profile.response';

export class DeleteProfileCommand {
  constructor(public profile: ProfileResponse) {}
}
