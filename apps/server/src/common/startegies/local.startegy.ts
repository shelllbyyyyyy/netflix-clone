import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { BcryptService } from '@/shared/libs/bcrypt';
import { FindUserByEmailQuery } from '@/module/users/application/queries';
import { UserResponse } from '@/module/users/application/response/user.reponse';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly bcryptService: BcryptService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const query = new FindUserByEmailQuery(email);

    const user = await this.queryBus.execute<
      FindUserByEmailQuery,
      UserResponse | null
    >(query);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const compare = await this.bcryptService.comparePassword(
      password,
      user.password,
    );

    if (!compare) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
