import { Test, TestingModule } from '@nestjs/testing';

import { RedisService } from '@/shared/libs/redis/redis.service';
import { PGUserRepository } from '@/shared/libs/constant';

import { UserRepository } from '../domain/repositories/user.repository';
import { UpdateProviderHandler } from '../application/commands/update-provider.handler';
import {
  deepCopy,
  email,
  provider,
  id,
  mockRedisService,
  mockUserRepository,
  phone_number,
  user,
  userResponse,
} from './mock';
import { UpdateProviderCommand } from '../application/commands';
import { Provider } from '../domain/value-object/provider';

describe('Update Provider Handler', () => {
  let userRepository: UserRepository;
  let redisService: RedisService;
  let updateProviderHandler: UpdateProviderHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProviderHandler,
        { provide: RedisService, useValue: mockRedisService },
        { provide: PGUserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(PGUserRepository);
    redisService = module.get<RedisService>(RedisService);
    updateProviderHandler = module.get<UpdateProviderHandler>(
      UpdateProviderHandler,
    );

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(userRepository).toBeDefined();
    expect(redisService).toBeDefined();
    expect(updateProviderHandler).toBeDefined();
  });

  it('Should success update provider', async () => {
    const newProvider = 'google';

    const newUserResponse = deepCopy(userResponse);
    newUserResponse['provider'] = newProvider;

    const newUser = user.clone();
    newUser.setProvider(new Provider(newProvider));

    mockUserRepository.updateProvider.mockResolvedValue(true);
    mockRedisService.set.mockResolvedValueOnce(newUserResponse);
    mockRedisService.set.mockResolvedValueOnce(newUserResponse);
    mockRedisService.set.mockResolvedValueOnce(newUserResponse);

    const result = await updateProviderHandler.execute(
      new UpdateProviderCommand(userResponse, {
        provider: newProvider,
      }),
    );

    expect(result).toBeTruthy();
    expect(mockUserRepository.updateProvider).toHaveBeenCalledWith(newUser);
    expect(mockRedisService.set).toHaveBeenCalledTimes(3);
    expect(mockRedisService.set).toHaveBeenNthCalledWith(
      1,
      `user with ${email}: `,
      newUserResponse,
      60 * 60 * 30 * 24,
    );
    expect(mockRedisService.set).toHaveBeenNthCalledWith(
      2,
      `user with ${id}: `,
      newUserResponse,
      60 * 60 * 30 * 24,
    );
    expect(mockRedisService.set).toHaveBeenNthCalledWith(
      3,
      `user with ${phone_number}: `,
      newUserResponse,
      60 * 60 * 30 * 24,
    );
  });

  it('Should fail update provider with undefined provider', async () => {
    mockUserRepository.updateProvider.mockResolvedValue(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);

    await expect(
      updateProviderHandler.execute(
        new UpdateProviderCommand(userResponse, {
          provider: undefined,
        }),
      ),
    ).rejects.toThrow(new Error('New provider cannot be undefined'));

    expect(mockUserRepository.updateProvider).not.toHaveBeenCalled();
    expect(mockRedisService.set).not.toHaveBeenCalledTimes(3);
    expect(mockRedisService.set).not.toHaveBeenNthCalledWith(
      1,
      `user with ${email}: `,
      userResponse,
      60 * 60 * 30 * 24,
    );
    expect(mockRedisService.set).not.toHaveBeenNthCalledWith(
      2,
      `user with ${id}: `,
      userResponse,
      60 * 60 * 30 * 24,
    );
    expect(mockRedisService.set).not.toHaveBeenNthCalledWith(
      3,
      `user with ${phone_number}: `,
      userResponse,
      60 * 60 * 30 * 24,
    );
  });

  it('Should fail update provider cause new provider is the same as the older one', async () => {
    mockUserRepository.updateProvider.mockResolvedValue(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);

    await expect(
      updateProviderHandler.execute(
        new UpdateProviderCommand(userResponse, {
          provider: provider,
        }),
      ),
    ).rejects.toThrow(
      new Error('Provider cannot be the same as the older one'),
    );

    expect(mockUserRepository.updateProvider).not.toHaveBeenCalled();
    expect(mockRedisService.set).not.toHaveBeenCalledTimes(3);
    expect(mockRedisService.set).not.toHaveBeenNthCalledWith(
      1,
      `user with ${email}: `,
      userResponse,
      60 * 60 * 30 * 24,
    );
    expect(mockRedisService.set).not.toHaveBeenNthCalledWith(
      2,
      `user with ${id}: `,
      userResponse,
      60 * 60 * 30 * 24,
    );
    expect(mockRedisService.set).not.toHaveBeenNthCalledWith(
      3,
      `user with ${phone_number}: `,
      userResponse,
      60 * 60 * 30 * 24,
    );
  });
});
