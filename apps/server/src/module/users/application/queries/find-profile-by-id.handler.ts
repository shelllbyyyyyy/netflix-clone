import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { ESProfileRepository } from '@/shared/libs/constant';

import { FindProfileByIdQuery } from './find-profile-by-id.query';
import { ProfileFactory } from '../../domain/factories/profile.factory';
import { ProfileRepository } from '../../domain/repositories/profile.repository';
import { ProfileId } from '../../domain/value-object/profileId';
import { ProfileResponse } from '../response/profile.response';

@QueryHandler(FindProfileByIdQuery)
export class FindProfileByIdHandler
  implements IQueryHandler<FindProfileByIdQuery, ProfileResponse | null>
{
  constructor(
    @Inject(ESProfileRepository)
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(query: FindProfileByIdQuery): Promise<ProfileResponse | null> {
    const id = new ProfileId(query.id);
    const profile = await this.profileRepository.findById(id);

    if (!profile) return null;

    return ProfileFactory.toResponse(profile);
  }
}
