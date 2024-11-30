import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { InvalidInputError } from '@/common/exceptions/invalid-input.error';
import { RedisService } from '@/shared/libs/redis/redis.service';
import { PGUserRepository } from '@/shared/libs/constant';

import { UpdateProviderCommand } from './update-provider.command';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserFactory } from '../../domain/factories/user.factory';
import { Provider } from '../../domain/value-object/provider';

@CommandHandler(UpdateProviderCommand)
export class UpdateProviderHandler
  implements ICommandHandler<UpdateProviderCommand, boolean>
{
  constructor(
    private readonly redisService: RedisService,
    @Inject(PGUserRepository) private readonly userRepository: UserRepository,
  ) {}

  async execute(command: UpdateProviderCommand): Promise<boolean> {
    const { data, payload } = command;

    const { provider } = payload;

    if (!provider) {
      throw new InvalidInputError('New provider cannot be undefined');
    } else if (provider === data.provider) {
      throw new InvalidInputError(
        'Provider cannot be the same as the older one',
      );
    }

    const user = UserFactory.toDomain(data);
    user.setProvider(new Provider(provider));

    const result = await this.userRepository.updateProvider(user);
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
