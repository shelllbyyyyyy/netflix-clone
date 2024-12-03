export class CreateUserCommand {
  constructor(
    public fullname: string,
    public phone_number: string,
    public email: string,
    public password: string,
    public provider: string,
  ) {}
}
