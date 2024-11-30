import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { InvalidInputError } from '@/common/exceptions/invalid-input.error';
import { BcryptService } from '@/shared/libs/bcrypt';
import { RedisService } from '@/shared/libs/redis/redis.service';
import { PGUserRepository } from '@/shared/libs/constant';

import { UserRepository } from '../../domain/repositories/user.repository';
import { ChangePasswordCommand } from './change-password.command';
import { UserFactory } from '../../domain/factories/user.factory';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler
  implements ICommandHandler<ChangePasswordCommand, boolean>
{
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly redisService: RedisService,
    @Inject(PGUserRepository) private readonly userRepository: UserRepository,
  ) {}

  async execute(command: ChangePasswordCommand): Promise<boolean> {
    const { data, payload } = command;

    const { password, current_password } = payload;

    if (!password || !current_password) {
      throw new InvalidInputError(
        'New password/old password cannot be undefined',
      );
    } else if (password === current_password) {
      throw new InvalidInputError(
        'Password cannot be the same as the older one',
      );
    }

    const compare = await this.bcryptService.comparePassword(
      current_password,
      data.password,
    );
    if (!compare) throw new InvalidInputError('Password not match');

    const hash_password = await this.bcryptService.hashPassword(password);

    const user = UserFactory.toDomain(data);
    user.setPassword(hash_password);

    const result = await this.userRepository.changePassword(user);
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
