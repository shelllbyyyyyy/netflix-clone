import { Injectable } from '@nestjs/common';

import { ProfileEntity } from '../entities/profile.entity';
import { ProfileId } from '../value-object/profileId';
import { UserId } from '../value-object/userId';

@Injectable()
export abstract class ProfileRepository {
  abstract save(data: ProfileEntity): Promise<ProfileEntity>;
  abstract findById(id: ProfileId): Promise<ProfileEntity>;
  abstract findByUserId(id: UserId): Promise<ProfileEntity[]>;
  abstract delete(data: ProfileEntity): Promise<boolean>;
  abstract update(data: Record<string, any>): Promise<boolean>;
}
