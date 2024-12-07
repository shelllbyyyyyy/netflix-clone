import { Injectable, Logger } from '@nestjs/common';
import { estypes } from '@elastic/elasticsearch';

import { SearchService } from '@/shared/libs/elastic/search.service';

import { ProfileResponse } from '../../application/response/profile.response';
import { ProfileEntity } from '../../domain/entities/profile.entity';
import { ProfileFactory } from '../../domain/factories/profile.factory';
import { ProfileRepository } from '../../domain/repositories/profile.repository';
import { ProfileId } from '../../domain/value-object/profileId';
import { UserId } from '../../domain/value-object/userId';

@Injectable()
export class ESProfileRepositoryImpl implements ProfileRepository {
  private readonly profilesIndex = 'profiles';
  private readonly logger = new Logger(ESProfileRepositoryImpl.name);

  constructor(private readonly searchService: SearchService) {}

  async save(data: ProfileEntity): Promise<ProfileEntity> {
    const profile = ProfileFactory.toResponse(data);

    const { result, _shards } = await this.searchService.index<ProfileResponse>(
      this.profilesIndex,
      data.getId.getValue,
      profile,
    );

    if (result !== 'created') return null;

    this.logger.log(`${_shards.successful} document created`);

    return data;
  }

  async delete(data: ProfileEntity): Promise<boolean> {
    const { result, _shards } = await this.searchService.delete(
      this.profilesIndex,
      data.getId.getValue,
    );
    if (result != 'deleted') return false;

    this.logger.log(`${_shards.successful} document deleted`);

    return true;
  }

  async findById(id: ProfileId): Promise<ProfileEntity | null> {
    const query: estypes.QueryDslQueryContainer = {
      term: {
        _id: id.getValue,
      },
    };

    const { hits } = await this.searchService.searchExact<ProfileResponse>(
      this.profilesIndex,
      query,
    );

    const total =
      typeof hits.total === 'number' ? hits.total : hits.total?.value;

    if (hits.hits.length == 0) return null;

    this.logger.log(`${total} document found`);

    return ProfileFactory.toDomain(hits.hits[0]._source);
  }

  async findByUserId(id: UserId): Promise<ProfileEntity[]> {
    const query: estypes.QueryDslQueryContainer = {
      match: {
        user_id: id.getValue,
      },
    };

    const { hits } = await this.searchService.searchExact<ProfileResponse>(
      this.profilesIndex,
      query,
    );

    const total =
      typeof hits.total === 'number' ? hits.total : hits.total?.value;

    this.logger.log(`${total} document found`);

    if (hits.hits.length === 0) return [];

    const result = hits.hits.map((p) => p._source);

    return ProfileFactory.toDomains(result);
  }

  async update(data: Record<string, any>): Promise<boolean> {
    const { result, _shards } = await this.searchService.update(
      this.profilesIndex,
      data.id,
      {
        avatar_url: data.avatar_url,
        profile_name: data.profile_name,
        updated_at: data.updated_at,
      },
    );

    if (result == 'updated') return true;

    this.logger.log(`${_shards.successful} document updated`);

    return false;
  }
}
