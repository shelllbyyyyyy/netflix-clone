import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { InvalidInputError } from '@/common/exceptions/invalid-input.error';
import { BcryptService } from '@/shared/libs/bcrypt';
import { RedisService } from '@/shared/libs/redis/redis.service';
import { PGUserRepository } from '@/shared/libs/constant';

import { UserRepository } from '../../domain/repositories/user.repository';
import { ChangeEmailCommand } from './change-email.command';
import { Email } from '../../domain/value-object/email';
import { UserFactory } from '../../domain/factories/user.factory';

@CommandHandler(ChangeEmailCommand)
export class ChangeEmailHandler
  implements ICommandHandler<ChangeEmailCommand, boolean>
{
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly redisService: RedisService,
    @Inject(PGUserRepository) private readonly userRepository: UserRepository,
  ) {}

  async execute(command: ChangeEmailCommand): Promise<boolean> {
    const { data, payload } = command;

    const { email, current_password } = payload;

    if (!email || !current_password) {
      throw new InvalidInputError('New email/old password cannot be undefined');
    } else if (email === data.email) {
      throw new InvalidInputError('Email cannot be the same as the older one');
    }

    const compare = await this.bcryptService.comparePassword(
      current_password,
      data.password,
    );
    if (!compare) throw new InvalidInputError('Password not match');

    const newEmail = new Email(email);

    const user = UserFactory.toDomain(data);
    user.setEmail(newEmail);

    const result = await this.userRepository.changeEmail(user);

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
