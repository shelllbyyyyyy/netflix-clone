import { ProfileResponse } from '../response/profile.response';

export class EditProfileCommand {
  constructor(
    public profile: ProfileResponse,
    public profile_name?: string,
    public profile_picture?: Express.Multer.File,
  ) {}
}
