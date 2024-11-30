import { Injectable } from '@nestjs/common';

import { BcryptService } from '@/shared/libs/bcrypt';
import { UserResponse } from '@/module/users/application/response/user.reponse';
import { IUseCase } from '@/common/interface/use-case';

type Payload = {
  user: UserResponse;
  password: string;
};

@Injectable()
export class ValidateUserCredentials implements IUseCase<Payload, boolean> {
  constructor(private readonly bcryptService: BcryptService) {}

  async execute(data: Payload): Promise<boolean> {
    const dbPassword = data.user.password;
    const inputPassword = data.password;

    const compare = await this.bcryptService.comparePassword(
      inputPassword,
      dbPassword,
    );
    if (!compare) return false;

    return true;
  }
}
