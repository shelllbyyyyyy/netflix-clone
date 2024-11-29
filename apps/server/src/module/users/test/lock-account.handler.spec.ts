import { Test, TestingModule } from '@nestjs/testing';

import { RedisService } from '@/shared/libs/redis/redis.service';
import { PGUserRepository } from '@/shared/libs/constant';

import { UserRepository } from '../domain/repositories/user.repository';
import { LockAccountHandler } from '../application/commands/lock-account.handler';
import {
  deepCopy,
  email,
  id,
  mockRedisService,
  mockUserRepository,
  phone_number,
  user,
  userResponse,
} from './mock';
import { LockAccountCommand } from '../application/commands';

describe('Lock Account Handler', () => {
  let userRepository: UserRepository;
  let redisService: RedisService;
  let lockAccountHandler: LockAccountHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LockAccountHandler,
        { provide: RedisService, useValue: mockRedisService },
        { provide: PGUserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(PGUserRepository);
    redisService = module.get<RedisService>(RedisService);
    lockAccountHandler = module.get<LockAccountHandler>(LockAccountHandler);

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(userRepository).toBeDefined();
    expect(redisService).toBeDefined();
    expect(LockAccountHandler).toBeDefined();
  });

  it('Should success lock account', async () => {
    const newUserResponse = deepCopy(userResponse);
    newUserResponse['is_account_non_expired'] = false;
    newUserResponse['is_account_non_locked'] = false;

    const newUser = user.clone();
    newUser.setIsAccountExpired(false);
    newUser.setIsAccountLocked(false);

    mockUserRepository.lockAccount.mockResolvedValue(true);
    mockRedisService.del.mockResolvedValueOnce(1);
    mockRedisService.del.mockResolvedValueOnce(1);
    mockRedisService.del.mockResolvedValueOnce(1);

    const result = await lockAccountHandler.execute(
      new LockAccountCommand(userResponse, {
        is_account_non_expired: false,
        is_account_non_locked: false,
      }),
    );

    expect(result).toBeTruthy();
    expect(mockUserRepository.lockAccount).toHaveBeenCalledWith(newUser);
    expect(mockRedisService.del).toHaveBeenCalledTimes(3);
    expect(mockRedisService.del).toHaveBeenNthCalledWith(
      1,
      `user with ${email}: `,
    );
    expect(mockRedisService.del).toHaveBeenNthCalledWith(
      2,
      `user with ${id}: `,
    );
    expect(mockRedisService.del).toHaveBeenNthCalledWith(
      3,
      `user with ${phone_number}: `,
    );
  });

  it('Should fail lock account with undefined value', async () => {
    mockUserRepository.lockAccount.mockResolvedValue(null);
    mockRedisService.del.mockResolvedValueOnce(null);
    mockRedisService.del.mockResolvedValueOnce(null);
    mockRedisService.del.mockResolvedValueOnce(null);

    await expect(
      lockAccountHandler.execute(
        new LockAccountCommand(userResponse, {
          is_account_non_expired: undefined,
          is_account_non_locked: undefined,
        }),
      ),
    ).rejects.toThrow(new Error('Value cannot be undefined'));

    expect(mockUserRepository.lockAccount).not.toHaveBeenCalled();
    expect(mockRedisService.del).not.toHaveBeenCalledTimes(3);
    expect(mockRedisService.del).not.toHaveBeenNthCalledWith(
      1,
      `user with ${email}: `,
    );
    expect(mockRedisService.del).not.toHaveBeenNthCalledWith(
      2,
      `user with ${id}: `,
    );
    expect(mockRedisService.del).not.toHaveBeenNthCalledWith(
      3,
      `user with ${phone_number}: `,
    );
  });

  it('Should fail lock account cause new value is the same as the older one', async () => {
    mockUserRepository.lockAccount.mockResolvedValue(null);
    mockRedisService.del.mockResolvedValueOnce(null);
    mockRedisService.del.mockResolvedValueOnce(null);
    mockRedisService.del.mockResolvedValueOnce(null);

    await expect(
      lockAccountHandler.execute(
        new LockAccountCommand(userResponse, {
          is_account_non_expired: true,
          is_account_non_locked: true,
        }),
      ),
    ).rejects.toThrow(new Error('Value cannot be the same as the older one'));

    expect(mockUserRepository.lockAccount).not.toHaveBeenCalled();
    expect(mockRedisService.del).not.toHaveBeenCalledTimes(3);
    expect(mockRedisService.del).not.toHaveBeenNthCalledWith(
      1,
      `user with ${email}: `,
    );
    expect(mockRedisService.del).not.toHaveBeenNthCalledWith(
      2,
      `user with ${id}: `,
    );
    expect(mockRedisService.del).not.toHaveBeenNthCalledWith(
      3,
      `user with ${phone_number}: `,
    );
  });
});
