import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { InvalidInputError } from '@/common/exceptions/invalid-input.error';
import { RedisService } from '@/shared/libs/redis/redis.service';
import { ESUserRepository, PGUserRepository } from '@/shared/libs/constant';

import { UserRepository } from '../../domain/repositories/user.repository';
import { VerifyUserCommand } from './verify-user.command';
import { UserFactory } from '../../domain/factories/user.factory';

@CommandHandler(VerifyUserCommand)
export class VerifyUserHandler
  implements ICommandHandler<VerifyUserCommand, boolean>
{
  constructor(
    private readonly redisService: RedisService,
    @Inject(PGUserRepository) private readonly userRepository: UserRepository,
    @Inject(ESUserRepository) private readonly esUserRepository: UserRepository,
  ) {}

  async execute(command: VerifyUserCommand): Promise<boolean> {
    const { data, payload } = command;

    const { is_verified } = payload;

    if (is_verified === undefined) {
      throw new InvalidInputError('Value cannot be undefined');
    } else if (is_verified === data.is_verified) {
      throw new InvalidInputError('Value cannot be the same as the older one');
    }

    const user = UserFactory.toDomain(data);
    user.setIsVerified(is_verified);

    const [pg, es] = await Promise.all([
      this.userRepository.updateProvider(user),
      this.esUserRepository.updateProvider(user),
    ]);

    if (pg && es) {
      const response = UserFactory.toResponse(user);

      await Promise.all([
        this.redisService.set(
          `user with ${user.getEmail.getValue}: `,
          response,
          30 * 24 * 60 * 60,
        ),

        this.redisService.set(
          `user with ${user.getId.getValue}: `,
          response,
          30 * 24 * 60 * 60,
        ),

        this.redisService.set(
          `user with ${user.getPhoneNumber}: `,
          response,
          30 * 24 * 60 * 60,
        ),
      ]);

      return true;
    }

    return false;
  }
}
