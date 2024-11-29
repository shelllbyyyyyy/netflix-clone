import { Test, TestingModule } from '@nestjs/testing';

import { RedisService } from '@/shared/libs/redis/redis.service';
import { PGUserRepository } from '@/shared/libs/constant';

import { UserRepository } from '../domain/repositories/user.repository';
import { VerifyUserHandler } from '../application/commands/verify-user.handler';
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
import { VerifyUserCommand } from '../application/commands';

describe('verify user Handler', () => {
  let userRepository: UserRepository;
  let redisService: RedisService;
  let verifyUserHandler: VerifyUserHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerifyUserHandler,
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: PGUserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(PGUserRepository);
    redisService = module.get<RedisService>(RedisService);
    verifyUserHandler = module.get<VerifyUserHandler>(VerifyUserHandler);

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(userRepository).toBeDefined();
    expect(redisService).toBeDefined();
    expect(VerifyUserHandler).toBeDefined();
  });

  it('Should success verify user', async () => {
    const newUserResponse = deepCopy(userResponse);
    newUserResponse['is_verified'] = true;

    const newUser = user.clone();
    newUser.setIsVerified(true);

    mockUserRepository.verifyUser.mockResolvedValue(true);
    mockRedisService.set.mockResolvedValueOnce(newUserResponse);
    mockRedisService.set.mockResolvedValueOnce(newUserResponse);
    mockRedisService.set.mockResolvedValueOnce(newUserResponse);

    const result = await verifyUserHandler.execute(
      new VerifyUserCommand(userResponse, {
        is_verified: true,
      }),
    );

    expect(result).toBeTruthy();
    expect(mockUserRepository.verifyUser).toHaveBeenCalledWith(newUser);
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

  it('Should fail verify user with undefined value', async () => {
    mockUserRepository.verifyUser.mockResolvedValue(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);

    await expect(
      verifyUserHandler.execute(
        new VerifyUserCommand(userResponse, {
          is_verified: undefined,
        }),
      ),
    ).rejects.toThrow(new Error('Value cannot be undefined'));

    expect(mockUserRepository.verifyUser).not.toHaveBeenCalled();
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

  it('Should fail verify user cause new value is the same as the older one', async () => {
    mockUserRepository.verifyUser.mockResolvedValue(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);

    await expect(
      verifyUserHandler.execute(
        new VerifyUserCommand(userResponse, {
          is_verified: false,
        }),
      ),
    ).rejects.toThrow(new Error('Value cannot be the same as the older one'));

    expect(mockUserRepository.verifyUser).not.toHaveBeenCalled();
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
