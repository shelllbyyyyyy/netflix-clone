import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { ESUserRepository } from '@/shared/libs/constant';
import { Pagination } from '@/common/interface/pagination-search.result';

import { FindUserByFilterQuery } from './find-user-by-filter.query';
import { UserRepository } from '../../domain/repositories/user.repository';
import { Email } from '../../domain/value-object/email';
import { UserId } from '../../domain/value-object/userId';
import { UserFactory } from '../../domain/factories/user.factory';
import { UserResponse } from '../response/user.reponse';

@QueryHandler(FindUserByFilterQuery)
export class FindUserByFilterhandler
  implements IQueryHandler<FindUserByFilterQuery, Pagination<UserResponse[]>>
{
  constructor(
    @Inject(ESUserRepository) private readonly userRepository: UserRepository,
  ) {}

  async execute(
    query: FindUserByFilterQuery,
  ): Promise<Pagination<UserResponse[]>> {
    const email = query.email ? new Email(query.email) : null;
    const id = query.userId ? new UserId(query.userId) : null;

    let offset: number;
    const {
      created_at,
      created_at_end,
      created_at_start,
      is_verified,
      limit,
      page,
      order_by,
      fullname,
      phone_number,
      profile_id,
    } = query;

    if (page) {
      offset = (page - 1) * limit;
    }

    const result = await this.userRepository.filterBy({
      created_at,
      created_at_end,
      created_at_start,
      email,
      fullname,
      id,
      is_verified,
      limit,
      offset,
      order_by,
      phone_number,
      profile_id,
    });

    return {
      data: UserFactory.toResponses(result.data),
      limit: result.limit,
      page: result.page,
      total: result.total,
      total_pages: result.total_pages,
    };
  }
}
