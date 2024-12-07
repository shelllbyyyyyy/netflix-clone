import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { ESProfileRepository } from '@/shared/libs/constant';

import { ProfileFactory } from '../../domain/factories/profile.factory';
import { ProfileRepository } from '../../domain/repositories/profile.repository';
import { ProfileResponse } from '../response/profile.response';
import { FindProfileByUserIdQuery } from './find-profile-by-user-id.query';
import { UserId } from '../../domain/value-object/userId';

@QueryHandler(FindProfileByUserIdQuery)
export class FindProfileByUserIdHandler
  implements IQueryHandler<FindProfileByUserIdQuery, ProfileResponse[]>
{
  constructor(
    @Inject(ESProfileRepository)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(query: FindProfileByUserIdQuery): Promise<ProfileResponse[]> {
    const id = new UserId(query.user_id);
    const profile = await this.profileRepository.findByUserId(id);

    if (profile.length == 0) return [];

    return ProfileFactory.toResponses(profile);
  }
}
