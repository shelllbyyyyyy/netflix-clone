import { Injectable } from '@nestjs/common';

import { IUseCase } from '@/common/interface/use-case';
import { Tokenizer } from '@/shared/libs/tokenizer';

type Payload = {
  sub: string;
  email: string;
};

@Injectable()
export class GenerateRefreshToken
  implements IUseCase<Payload, { access_token: string } | null>
{
  constructor(private readonly tokenizer: Tokenizer) {}

  async execute(data: Payload): Promise<{ access_token: string } | null> {
    if (!data) return null;

    const access_token = await this.tokenizer.generateToken(data, '15m');

    return {
      access_token,
    };
  }
}
