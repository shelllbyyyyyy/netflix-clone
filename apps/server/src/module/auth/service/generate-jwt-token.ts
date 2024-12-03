import { Injectable } from '@nestjs/common';

import { IUseCase } from '@/common/interface/use-case';
import { Tokenizer } from '@/shared/libs/tokenizer';
import { UserResponse } from '@/module/users/application/response/user.reponse';

import { JwtResponse } from '../response/jwt-response';

@Injectable()
export class GenerateJwtToken
  implements IUseCase<UserResponse, JwtResponse | null>
{
  constructor(private readonly tokenizer: Tokenizer) {}

  async execute(data: UserResponse): Promise<JwtResponse | null> {
    if (!data) return null;

    const payload = {
      sub: data.id,
      email: data.email,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.tokenizer.generateToken(payload, '15m'),
      this.tokenizer.generateToken(payload, '7d'),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }
}
