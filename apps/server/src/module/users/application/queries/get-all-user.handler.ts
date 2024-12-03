import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetAllUserQuery } from './get-all-user.query';
import { UserResponse } from '../response/user.reponse';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserFactory } from '../../domain/factories/user.factory';

import { PGUserRepository } from '@/shared/libs/constant';

@QueryHandler(GetAllUserQuery)
export class GetAllUserHandler
  implements IQueryHandler<GetAllUserQuery, UserResponse[]>
{
  constructor(
    @Inject(PGUserRepository) private readonly userRepository: UserRepository,
  ) {}

  async execute(query: GetAllUserQuery): Promise<UserResponse[]> {
    const users = await this.userRepository.findAll();

    return UserFactory.toResponses(users);
  }
}
