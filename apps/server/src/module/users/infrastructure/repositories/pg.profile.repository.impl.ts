import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '@/shared/libs/pg/database.service';

import { ProfileRepository } from '../../domain/repositories/profile.repository';
import { ProfileEntity } from '../../domain/entities/profile.entity';
import { ProfileId } from '../../domain/value-object/profileId';
import { UserId } from '../../domain/value-object/userId';
import { ProfileFactory } from '../../domain/factories/profile.factory';

@Injectable()
export class PGProfileRepositoryImpl implements ProfileRepository {
  private readonly logger = new Logger(PGProfileRepositoryImpl.name);

  constructor(private readonly dbService: DatabaseService) {}

  async save(data: ProfileEntity): Promise<ProfileEntity> {
    const query = `
    INSERT INTO public.profiles (id, user_id, profile_name, avatar_url)
    VALUES ($1, $2, $3, $4)
    RETURNING *;`;

    const values = [
      data.getId.getValue,
      data.getUserId.getValue,
      data.getProfileName,
      data.getAvatarUrl,
    ];

    const result = await this.dbService.query(query, values);

    this.logger.log(`${result.rowCount} rows affected`);

    return ProfileFactory.toDomain(result.rows[0]);
  }

  async delete(data: ProfileEntity): Promise<boolean> {
    const query = `
    DELETE FROM public.profiles
    WHERE id = $1;`;

    const values = [data.getId.getValue];

    const result = await this.dbService.query(query, values);

    if (result.rowCount == 0) {
      this.logger.log(`${result.rowCount} rows affected`);

      return false;
    }

    this.logger.log(`${result.rowCount} rows affected`);

    return true;
  }

  async findById(id: ProfileId): Promise<ProfileEntity> {
    const query = `
    SELECT * FROM public.profiles
    WHERE id = $1;`;

    const result = await this.dbService.query(query, [id.getValue]);

    this.logger.log(`${result.rowCount} rows affected`);

    return ProfileFactory.toDomain(result.rows[0]);
  }

  async findByUserId(id: UserId): Promise<ProfileEntity[]> {
    const query = `
    SELECT * FROM public.profiles
    WHERE user_id = $1;`;

    const values = [id.getValue];

    const result = await this.dbService.query(query, values);

    this.logger.log(`${result.rowCount} rows affected`);

    return ProfileFactory.toDomains(result.rows);
  }

  async update(data: Record<string, any>): Promise<boolean> {
    const query = `
      UPDATE public.profiles
SET profile_name = COALESCE($1, profile_name),
    avatar_url = COALESCE($2, avatar_url)
WHERE id = $3;`;

    const values = [data.profile_name, data.avatar_url, data.id];

    const result = await this.dbService.query(query, values);

    if (result.rowCount > 0) return true;

    return false;
  }
}
