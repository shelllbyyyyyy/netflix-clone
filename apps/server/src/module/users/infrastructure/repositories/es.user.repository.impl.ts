import { Injectable } from '@nestjs/common';
import { estypes } from '@elastic/elasticsearch';

import { Pagination } from '@/common/interface/pagination-search.result';
import { SearchService } from '@/shared/libs/elastic/search.service';

import { UserResponse } from '../../application/response/user.reponse';
import { Filter } from '../../application/type/filter-user';

import { UserEntity } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-object/email';
import { UserId } from '../../domain/value-object/userId';
import { UserFactory } from '../../domain/factories/user.factory';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class ESUserRepositoryImpl implements UserRepository {
  index = 'users';
  constructor(private readonly searchService: SearchService) {}

  async findAll(): Promise<UserEntity[]> {
    return;
  }

  async save(data: UserEntity): Promise<UserEntity> {
    const user = UserFactory.toResponse(data);

    const { hits } = await this.searchService.index<UserResponse>(
      this.index,
      data.getId.getValue,
      user,
    );

    if (hits.hits.length === 0) return null;

    return UserFactory.toDomain(hits.hits[0]._source);
  }

  async findByEmail(email: Email): Promise<UserEntity | null> {
    const query = {
      match: {
        email: email.getValue,
      },
    };

    const { hits } = await this.searchService.searchExact(this.index, query);
    const result = hits.hits;

    if (result.length === 0) return null;

    return UserFactory.toDomain(result[0]._source);
  }

  async findById(id: UserId): Promise<UserEntity | null> {
    const query = {
      match: {
        id: id.getValue,
      },
    };

    const { hits } = await this.searchService.searchExact(this.index, query);
    const result = hits.hits;

    if (result.length === 0) return null;

    return UserFactory.toDomain(result[0]._source);
  }

  async findByPhoneNumber(phone_number: string): Promise<UserEntity | null> {
    const query = {
      match: {
        phone_number: phone_number,
      },
    };

    const { hits } = await this.searchService.searchExact(this.index, query);
    const result = hits.hits;

    if (result.length === 0) return null;

    return UserFactory.toDomain(result[0]._source);
  }

  async delete(data: UserEntity): Promise<boolean> {
    const { result } = await this.searchService.delete(
      this.index,
      data.getId.getValue,
    );
    if (result == 'not_found') return false;

    return true;
  }

  async update(data: UserEntity): Promise<boolean> {
    const doc = UserFactory.toResponse(data);

    const { _shards } = await this.searchService.update(
      this.index,
      data.getId.getValue,
      doc,
    );
    if (_shards.successful == 0) return false;

    return true;
  }

  async changeEmail(data: UserEntity): Promise<boolean> {
    const { _shards } = await this.searchService.update(
      this.index,
      data.getId.getValue,
      { email: data.getEmail.getValue },
    );
    if (_shards.successful == 0) return false;

    return true;
  }

  async changePassword(data: UserEntity): Promise<boolean> {
    const { _shards } = await this.searchService.update(
      this.index,
      data.getId.getValue,
      { password: data.getPassword },
    );
    if (_shards.successful == 0) return false;

    return true;
  }

  async updateProvider(data: UserEntity): Promise<boolean> {
    const { _shards } = await this.searchService.update(
      this.index,
      data.getId.getValue,
      { provider: data.getProvider.getValue },
    );
    if (_shards.successful == 0) return false;

    return true;
  }

  async verifyUser(data: UserEntity): Promise<boolean> {
    const { _shards } = await this.searchService.update(
      this.index,
      data.getId.getValue,
      { is_verified: data.getIsVerified },
    );
    if (_shards.successful == 0) return false;

    return true;
  }

  async changeFullname(data: UserEntity): Promise<boolean> {
    const { _shards } = await this.searchService.update(
      this.index,
      data.getId.getValue,
      { fullname: data.getFullname },
    );
    if (_shards.successful == 0) return false;

    return true;
  }

  async changePhoneNumber(data: UserEntity): Promise<boolean> {
    const { _shards } = await this.searchService.update(
      this.index,
      data.getId.getValue,
      { phone_number: data.getPhoneNumber },
    );
    if (_shards.successful == 0) return false;

    return true;
  }

  async lockAccount(data: UserEntity): Promise<boolean> {
    const { _shards } = await this.searchService.update(
      this.index,
      data.getId.getValue,
      {
        is_account_non_locked: data.getIsAccountNonLocked,
        is_account_non_expired: data.getIsAccountNonExpired,
      },
    );
    if (_shards.successful == 0) return false;

    return true;
  }

  async filterBy(data: Filter): Promise<Pagination<any>> {
    const sort: Record<string, string> = {};

    if (data.order_by) {
      const eek = data.order_by.split('-');
      const sortField = eek[0];
      const sortOrder = eek[1].toLowerCase();
      sort[sortField] = sortOrder;
    }

    const query: any = {
      bool: {
        should: [],
        filter: [],
      },
    };

    if (data.created_at_start && data.created_at_end) {
      query.bool.filter.push({
        range: {
          created_at: {
            gte: data.created_at_start,
            lte: data.created_at_end,
          },
        },
      });
    }

    if (data.id) {
      query.bool.should.push({
        match: { id: data.id.getValue },
      });
    }

    if (data.fullname) {
      query.bool.should.push({
        wildcard: { fullname: { value: `${data.fullname}*` } },
      });
    }

    if (data.email) {
      query.bool.should.push({
        match: { email: data.email.getValue },
      });
    }

    if (data.is_verified !== undefined) {
      query.bool.filter.push({
        term: { is_verified: data.is_verified },
      });
    }

    if (data.profile_id) {
      query.bool.should.push({
        match: { id: data.profile_id },
      });
    }

    const defaultLimit = 10;
    const defaultOffset = 0;

    const search = await this.searchService.search<
      UserResponse[],
      Pagination<UserResponse[]>
    >(
      this.index,
      query as estypes.QueryDslQueryContainer,
      data.offset ? data.offset : defaultOffset,
      data.limit ? data.limit : defaultLimit,
      sort,
    );

    return {
      data: UserFactory.toDomains(search.data),
      page: search.page,
      limit: search.limit,
      total: search.total,
      total_pages: search.total_pages,
    };
  }
}
