import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { RedisService } from '@/shared/libs/redis/redis.service';
import { PGUserRepository } from '@/shared/libs/constant';

import { FindUserByPhoneNumberQuery } from './find-user-by-phone-number.query';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserFactory } from '../../domain/factories/user.factory';
import { UserResponse } from '../response/user.reponse';

@QueryHandler(FindUserByPhoneNumberQuery)
export class FindUserByPhoneNumberHandler
  implements IQueryHandler<FindUserByPhoneNumberQuery, UserResponse>
{
  constructor(
    @Inject(PGUserRepository) private readonly userRepository: UserRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(query: FindUserByPhoneNumberQuery): Promise<UserResponse> {
    if (query.phone_pumber === undefined) return null;

    const cache = await this.redisService.get<UserResponse>(
      `user with ${query.phone_pumber}: `,
    );
    if (cache !== null) return cache;

    const findUser = await this.userRepository.findByPhoneNumber(
      query.phone_pumber,
    );
    if (!findUser) return null;

    const result = UserFactory.toResponse(findUser);
    if (findUser)
      await this.redisService.set<UserResponse>(
        `user with ${result.phone_number}: `,
        result,
        60 * 60 * 30 * 24,
      );

    return result;
  }
}
