import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { RedisService } from '@/shared/libs/redis/redis.service';
import { BcryptService } from '@/shared/libs/bcrypt';
import { PGUserRepository } from '@/shared/libs/constant';

import { CreateUserCommand } from './create-user.command';

import { Email } from '../../domain/value-object/email';
import { Provider } from '../../domain/value-object/provider';
import { UserEntity } from '../../domain/entities/user.entity';
import { Provider as EnumProvider } from '../../domain/enum/provider.enum';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserFactory } from '../../domain/factories/user.factory';
import { UserResponse } from '../response/user.reponse';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler
  implements ICommandHandler<CreateUserCommand, UserResponse>
{
  constructor(
    @Inject(PGUserRepository) private readonly userRepository: UserRepository,
    private readonly redisService: RedisService,
    private readonly bcryptService: BcryptService,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserResponse> {
    const { fullname, password, phone_number } = command;

    const email = new Email(command.email);
    const hashed_password = await this.bcryptService.hashPassword(password);
    const user_provider = <EnumProvider>command.provider;
    const provider = new Provider(user_provider);

    const user = new UserEntity();
    user.setEmail(email);
    user.setFullname(fullname);
    user.setPhoneNumber(phone_number);
    user.setPassword(hashed_password);
    user.setProvider(provider);

    const saveUser = await this.userRepository.save(user);

    const result = UserFactory.toResponse(saveUser);

    if (saveUser) {
      await Promise.all([
        this.redisService.set(
          `user with ${result.email}: `,
          result,
          60 * 60 * 30 * 24,
        ),
        this.redisService.set(
          `user with ${result.id}: `,
          result,
          60 * 60 * 30 * 24,
        ),
        this.redisService.set(
          `user with ${result.phone_number}: `,
          result,
          60 * 60 * 30 * 24,
        ),
      ]);
    }

    return result;
  }
}
