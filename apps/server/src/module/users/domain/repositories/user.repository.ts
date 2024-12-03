import { Injectable } from '@nestjs/common';

import { UserEntity } from '../entities/user.entity';
import { Email } from '../value-object/email';
import { UserId } from '../value-object/userId';
import { Filter } from '../../application/type/filter-user';
import { Pagination } from '@/common/interface/pagination-search.result';

@Injectable()
export abstract class UserRepository {
  abstract findAll(): Promise<UserEntity[]>;
  abstract save(data: UserEntity): Promise<UserEntity>;
  abstract findById(id: UserId): Promise<UserEntity | null>;
  abstract findByEmail(email: Email): Promise<UserEntity | null>;
  abstract findByPhoneNumber(phone_number: string): Promise<UserEntity | null>;
  abstract delete(data: UserEntity): Promise<boolean>;
  abstract update(data: UserEntity): Promise<boolean>;
  abstract lockAccount(data: UserEntity): Promise<boolean>;
  abstract changePassword(data: UserEntity): Promise<boolean>;
  abstract changePhoneNumber(data: UserEntity): Promise<boolean>;
  abstract changeEmail(data: UserEntity): Promise<boolean>;
  abstract changeFullname(data: UserEntity): Promise<boolean>;
  abstract updateProvider(data: UserEntity): Promise<boolean>;
  abstract verifyUser(data: UserEntity): Promise<boolean>;
  abstract filterBy(data: Filter): Promise<Pagination<UserEntity[]>>;
}
