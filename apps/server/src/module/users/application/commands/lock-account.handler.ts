import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { InvalidInputError } from '@/common/exceptions/invalid-input.error';
import { RedisService } from '@/shared/libs/redis/redis.service';
import { ESUserRepository, PGUserRepository } from '@/shared/libs/constant';

import { UserRepository } from '../../domain/repositories/user.repository';
import { LockAccountCommand } from './lock-account.command';
import { UserFactory } from '../../domain/factories/user.factory';

@CommandHandler(LockAccountCommand)
export class LockAccountHandler
  implements ICommandHandler<LockAccountCommand, boolean>
{
  constructor(
    private readonly redisService: RedisService,
    @Inject(PGUserRepository) private readonly userRepository: UserRepository,
    @Inject(ESUserRepository) private readonly esUserRepository: UserRepository,
  ) {}

  async execute(command: LockAccountCommand): Promise<boolean> {
    const { data, payload } = command;

    const { is_account_non_expired, is_account_non_locked } = payload;

    if (
      is_account_non_expired === undefined ||
      is_account_non_locked === undefined
    ) {
      throw new InvalidInputError('Value cannot be undefined');
    } else if (
      is_account_non_expired === data.is_account_non_expired ||
      is_account_non_locked === data.is_account_non_locked
    ) {
      throw new InvalidInputError('Value cannot be the same as the older one');
    }

    const user = UserFactory.toDomain(data);
    user.setIsAccountLocked(is_account_non_locked);
    user.setIsAccountExpired(is_account_non_expired);

    const [pg, es] = await Promise.all([
      this.userRepository.lockAccount(user),
      this.esUserRepository.lockAccount(user),
    ]);

    if (pg && es) {
      await Promise.all([
        this.redisService.del(`user with ${user.getEmail.getValue}: `),
        this.redisService.del(`user with ${user.getId.getValue}: `),
        this.redisService.del(`user with ${user.getPhoneNumber}: `),
      ]);

      return true;
    }

    return false;
  }
}
