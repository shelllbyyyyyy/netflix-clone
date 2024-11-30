import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { RedisService } from '@/shared/libs/redis/redis.service';
import { PGUserRepository } from '@/shared/libs/constant';

import { FindUserByEmailQuery } from './find-user-by-email.query';
import { UserResponse } from '../response/user.reponse';
import { Email } from '../../domain/value-object/email';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserFactory } from '../../domain/factories/user.factory';

@QueryHandler(FindUserByEmailQuery)
export class FindUserByEmailHandler
  implements IQueryHandler<FindUserByEmailQuery, UserResponse | null>
{
  constructor(
    @Inject(PGUserRepository) private readonly userRepository: UserRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(query: FindUserByEmailQuery): Promise<UserResponse | null> {
    const cache = await this.redisService.get<UserResponse>(
      `user with ${query.email}: `,
    );
    if (cache !== null) return cache;

    const email = new Email(query.email);

    const findUser = await this.userRepository.findByEmail(email);
    if (!findUser) return null;

    const result = UserFactory.toResponse(findUser);
    if (findUser)
      await this.redisService.set<UserResponse>(
        `user with ${result.email}: `,
        result,
        60 * 60 * 30 * 24,
      );

    return result;
  }
}
