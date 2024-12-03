import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { InvalidInputError } from '@/common/exceptions/invalid-input.error';
import { RedisService } from '@/shared/libs/redis/redis.service';
import { PGUserRepository } from '@/shared/libs/constant';

import { UserRepository } from '../../domain/repositories/user.repository';
import { ChangeFullnameCommand } from './change-fullname.command';
import { UserFactory } from '../../domain/factories/user.factory';

@CommandHandler(ChangeFullnameCommand)
export class ChangeFullnameHandler
  implements ICommandHandler<ChangeFullnameCommand, boolean>
{
  constructor(
    private readonly redisService: RedisService,
    @Inject(PGUserRepository) private readonly userRepository: UserRepository,
  ) {}

  async execute(command: ChangeFullnameCommand): Promise<boolean> {
    const { data, payload } = command;

    const { fullname } = payload;

    if (!fullname) {
      throw new InvalidInputError('New fullname cannot be undefined');
    } else if (fullname === data.fullname) {
      throw new InvalidInputError(
        'Fullname cannot be the same as the older one',
      );
    }

    const user = UserFactory.toDomain(data);
    user.setFullname(fullname);

    const result = await this.userRepository.changeFullname(user);
    if (result) {
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

      return result;
    }

    return false;
  }
}
