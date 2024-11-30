import { Injectable, Logger } from '@nestjs/common';

import { Pagination } from '@/common/interface/pagination-search.result';
import { DatabaseService } from '@/shared/libs/pg/database.service';

import { Filter } from '../../application/type/filter-user';

import { UserEntity } from '../../domain/entities/user.entity';
import { Provider } from '../../domain/enum/provider.enum';
import { UserFactory } from '../../domain/factories/user.factory';
import { UserRepository } from '../../domain/repositories/user.repository';
import { Email } from '../../domain/value-object/email';
import { UserId } from '../../domain/value-object/userId';

@Injectable()
export class PGUserRepositoryImpl implements UserRepository {
  private readonly logger = new Logger(PGUserRepositoryImpl.name);

  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<UserEntity[]> {
    const query = `SELECT * FROM public.users;`;

    const result = await this.db.query(query);

    this.logger.log(`${result.rowCount} Rows affected`);

    if (result.rows.length == 0) return [];

    return UserFactory.toDomains(result.rows);
  }

  async save(data: UserEntity): Promise<UserEntity> {
    const id = data.getId.getValue;
    const fullname = data.getFullname;
    const email = data.getEmail.getValue;
    const phone_number = data.getPassword;
    const password = data.getPassword;
    const provider = <Provider>data.getProvider.getValue;

    const query = `
    INSERT INTO users (id, fullname, email, phone_number, password, provider)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING*;`;

    const result = await this.db.query(query, [
      id,
      fullname,
      email,
      phone_number,
      password,
      provider,
    ]);

    this.logger.log(`${result.rowCount} Rows affected`);

    if (result.rowCount == 0) return null;

    return UserFactory.toDomain(result.rows[0]);
  }

  async findByEmail(email: Email): Promise<UserEntity | null> {
    const query = `
    SELECT * FROM public.users
    WHERE email = $1;`;

    const result = await this.db.query(query, [email.getValue]);

    this.logger.log(`${result.rowCount} Rows affected`);

    if (result.rows.length == 0) return null;

    return UserFactory.toDomain(result.rows[0]);
  }

  async findById(id: UserId): Promise<UserEntity | null> {
    const query = `
    SELECT * FROM public.users
    WHERE id = $1;`;

    const result = await this.db.query(query, [id.getValue]);

    this.logger.log(`${result.rowCount} Rows affected`);

    if (result.rows.length == 0) return null;

    return UserFactory.toDomain(result.rows[0]);
  }

  async findByPhoneNumber(phone_number: string): Promise<UserEntity | null> {
    const query = `
    SELECT * FROM public.users
    WHERE phone_number = $1;`;

    const result = await this.db.query(query, [phone_number]);

    this.logger.log(`${result.rowCount} Rows affected`);

    if (result.rows.length == 0) return null;

    return UserFactory.toDomain(result.rows[0]);
  }

  async delete(data: UserEntity): Promise<boolean> {
    const query = `
    DELETE FROM users 
    WHERE email = $1;`;

    const result = await this.db.query(query, [data.getEmail.getValue]);

    this.logger.log(`${result.rowCount} Rows affected`);
    if (result.rowCount == 0) return false;

    return true;
  }

  async update(data: UserEntity): Promise<boolean> {
    const email = data.getEmail.getValue;
    const fullname = data.getFullname;
    const is_verified = data.getIsVerified;
    const password = data.getPassword;
    const provider = data.getProvider;

    const query = `
    UPDATE users
    SET fullname = $1, email = $2, password = $3, is_verified = $4, provider = $5, updated_at = CURRENT_TIMESTAMP
    WHERE email = $2;`;

    const result = await this.db.query(query, [
      fullname,
      email,
      password,
      is_verified,
      provider,
    ]);

    this.logger.log(`${result.rowCount} Rows affected`);
    if (result.rowCount == 0) return false;

    return true;
  }

  async changeEmail(data: UserEntity): Promise<boolean> {
    const id = data.getId.getValue;
    const email = data.getEmail.getValue;

    const query = `
    UPDATE users
    SET email = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1;`;

    const result = await this.db.query(query, [id, email]);

    this.logger.log(`${result.rowCount} Rows affected`);
    if (result.rowCount == 0) return false;

    return true;
  }

  async changePassword(data: UserEntity): Promise<boolean> {
    const id = data.getId.getValue;
    const password = data.getPassword;

    const query = `
    UPDATE users
    SET password = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1;`;

    const result = await this.db.query(query, [id, password]);

    this.logger.log(`${result.rowCount} Rows affected`);
    if (result.rowCount == 0) return false;

    return true;
  }

  async updateProvider(data: UserEntity): Promise<boolean> {
    const id = data.getId.getValue;
    const provider = data.getProvider;

    const query = `
    UPDATE users
    SET provider = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1;`;

    const result = await this.db.query(query, [id, provider]);

    this.logger.log(`${result.rowCount} Rows affected`);
    if (result.rowCount == 0) return false;

    return true;
  }

  async verifyUser(data: UserEntity): Promise<boolean> {
    const id = data.getId.getValue;
    const is_verified = data.getIsVerified;

    const query = `
    UPDATE users
    SET is_verified = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1;`;

    const result = await this.db.query(query, [id, is_verified]);

    this.logger.log(`${result.rowCount} Rows affected`);
    if (result.rowCount == 0) return false;

    return true;
  }

  async changeFullname(data: UserEntity): Promise<boolean> {
    const id = data.getId.getValue;
    const fullname = data.getFullname;

    const query = `
    UPDATE users
    SET fullname = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1;`;

    const result = await this.db.query(query, [id, fullname]);

    this.logger.log(`${result.rowCount} Rows affected`);
    if (result.rowCount == 0) return false;

    return true;
  }

  async changePhoneNumber(data: UserEntity): Promise<boolean> {
    const id = data.getId.getValue;
    const phone_number = data.getPhoneNumber;

    const query = `
    UPDATE users
    SET phone_number = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1;`;

    const result = await this.db.query(query, [id, phone_number]);

    this.logger.log(`${result.rowCount} Rows affected`);
    if (result.rowCount == 0) return false;

    return true;
  }

  async lockAccount(data: UserEntity): Promise<boolean> {
    const id = data.getId.getValue;

    const query = `
    UPDATE users
    SET is_account_non_locked = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1;`;

    const result = await this.db.query(query, [id, false]);

    this.logger.log(`${result.rowCount} Rows affected`);
    if (result.rowCount == 0) return false;

    return true;
  }

  async filterBy(data: Filter): Promise<Pagination<any>> {
    const baseQuery = `
    SELECT 
      u.id, u.fullname, u.email, u.password, u.provider, u.is_verified,
      ARRAY_AGG(jsonb_build_object('role_id', r.role_id, 'authority', r.authority)) AS authorities
    FROM users u
    LEFT JOIN user_role_junction urj ON u.id = urj.user_id
    LEFT JOIN roles r ON urj.role_id = r.role_id
    `;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (data.id) {
      conditions.push(`u.id = $${paramIndex}`);
      params.push(data.id.getValue);
      paramIndex++;
    }

    if (data.email) {
      conditions.push(`u.email = $${paramIndex}`);
      params.push(data.email.getValue);
      paramIndex++;
    }

    if (data.fullname) {
      conditions.push(`u.fullname = $${paramIndex}`);
      params.push(data.fullname);
      paramIndex++;
    }

    if (data.created_at_start) {
      conditions.push(`u.created_at BETWEEN $${paramIndex} AND $${paramIndex}`);
      params.push(data.created_at_start, data.created_at_end);
      paramIndex++;
      paramIndex++;
    }

    if (data.created_at) {
      conditions.push(`u.created_at >= $${paramIndex}`);
      params.push(data.created_at);
      paramIndex++;
    }

    if (data.is_verified !== undefined) {
      conditions.push(`u.is_verified = $${paramIndex}`);
      params.push(data.is_verified);
      paramIndex++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const orderByClause = data.order_by ? `ORDER BY ${data.order_by}` : '';
    const limitClause = data.limit ? `LIMIT $${paramIndex}` : '';
    if (data.limit) {
      params.push(data.limit);
      paramIndex++;
    }
    const offsetClause = data.offset ? `OFFSET $${paramIndex}` : ``;
    if (data.offset) {
      params.push(String(data.offset));
    }

    const query = `
        ${baseQuery}
        ${whereClause}
        GROUP BY u.id, u.fullname, u.email, u.password, u.provider, u.is_verified
        ${orderByClause}
        ${limitClause}
        ${offsetClause};
    `;

    const countQuery = `
    SELECT COUNT(*) AS total
    FROM users u
    LEFT JOIN user_role_junction urj ON u.id = urj.user_id
    LEFT JOIN roles r ON urj.role_id = r.role_id
    ${whereClause};
  `;

    const result = await this.db.query(query, params);

    const countResult = await this.db.query(
      countQuery,
      params.splice(0, params.length - 2),
    );

    const total = countResult.rowCount;

    return {
      data: result.rows.map((row) => UserFactory.toDomain(row)),
      limit: +data.limit,
      page: Math.floor(data.offset / +data.limit) + 1,
      total,
      total_pages: Math.ceil(total / +data.limit),
    };
  }
}
