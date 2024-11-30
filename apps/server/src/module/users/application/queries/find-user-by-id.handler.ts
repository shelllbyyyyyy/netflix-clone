import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { RedisService } from '@/shared/libs/redis/redis.service';
import { PGUserRepository } from '@/shared/libs/constant';

import { FindUserByIdQuery } from './find-user-by-id.query';
import { UserId } from '../../domain/value-object/userId';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserFactory } from '../../domain/factories/user.factory';
import { UserResponse } from '../response/user.reponse';

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdHandler
  implements IQueryHandler<FindUserByIdQuery, UserResponse>
{
  constructor(
    @Inject(PGUserRepository) private readonly userRepository: UserRepository,
    private readonly redisService: RedisService,
  ) {}

  async execute(query: FindUserByIdQuery): Promise<UserResponse> {
    if (query.id === undefined) return null;
    const cache = await this.redisService.get<UserResponse>(
      `user with ${query.id}: `,
    );
    if (cache !== null) return cache;

    const id = new UserId(query.id);

    const findUser = await this.userRepository.findById(id);
    if (!findUser) return null;

    const result = UserFactory.toResponse(findUser);
    if (findUser)
      await this.redisService.set<UserResponse>(
        `user with ${result.id}: `,
        result,
        60 * 60 * 30 * 24,
      );

    return result;
  }
}
