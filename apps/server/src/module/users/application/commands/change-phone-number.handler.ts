import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { InvalidInputError } from '@/common/exceptions/invalid-input.error';
import { BcryptService } from '@/shared/libs/bcrypt';
import { RedisService } from '@/shared/libs/redis/redis.service';
import { ESUserRepository, PGUserRepository } from '@/shared/libs/constant';

import { UserRepository } from '../../domain/repositories/user.repository';
import { ChangePhoneNumberCommand } from './change-phone-number.command';
import { UserFactory } from '../../domain/factories/user.factory';

@CommandHandler(ChangePhoneNumberCommand)
export class ChangePhoneNumberHandler
  implements ICommandHandler<ChangePhoneNumberCommand, boolean>
{
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly redisService: RedisService,
    @Inject(PGUserRepository) private readonly userRepository: UserRepository,
    @Inject(ESUserRepository) private readonly esUserRepository: UserRepository,
  ) {}

  async execute(command: ChangePhoneNumberCommand): Promise<boolean> {
    const { data, payload } = command;

    const { phone_number, current_password } = payload;

    if (!phone_number || !current_password) {
      throw new InvalidInputError(
        'New phone number/old password cannot be undefined',
      );
    } else if (phone_number === data.phone_number) {
      throw new InvalidInputError(
        'phone number cannot be the same as the older one',
      );
    }

    const compare = await this.bcryptService.comparePassword(
      current_password,
      data.password,
    );
    if (!compare) throw new InvalidInputError('Password not match');

    const user = UserFactory.toDomain(data);
    user.setPhoneNumber(phone_number);

    const [pg, es] = await Promise.all([
      this.userRepository.changePhoneNumber(user),
      this.esUserRepository.changePhoneNumber(user),
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
