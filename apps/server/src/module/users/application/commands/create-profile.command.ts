export class CreateProfileCommand {
  constructor(
    public user_id: string,
    public profile_name: string,
    public profile_picture: Express.Multer.File,
  ) {}
}
