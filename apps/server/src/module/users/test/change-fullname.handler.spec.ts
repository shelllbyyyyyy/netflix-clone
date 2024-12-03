import { Test, TestingModule } from '@nestjs/testing';

import { RedisService } from '@/shared/libs/redis/redis.service';
import { PGUserRepository } from '@/shared/libs/constant';

import { UserRepository } from '../domain/repositories/user.repository';
import { ChangeFullnameHandler } from '../application/commands/change-fullname.handler';
import {
  deepCopy,
  email,
  fullname,
  id,
  mockRedisService,
  mockUserRepository,
  phone_number,
  user,
  userResponse,
} from './mock';
import { ChangeFullnameCommand } from '../application/commands';

describe('Change Fullname Handler', () => {
  let userRepository: UserRepository;
  let redisService: RedisService;
  let changeFullnameHandler: ChangeFullnameHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangeFullnameHandler,
        { provide: RedisService, useValue: mockRedisService },
        { provide: PGUserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(PGUserRepository);
    redisService = module.get<RedisService>(RedisService);
    changeFullnameHandler = module.get<ChangeFullnameHandler>(
      ChangeFullnameHandler,
    );

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(userRepository).toBeDefined();
    expect(redisService).toBeDefined();
    expect(changeFullnameHandler).toBeDefined();
  });

  it('Should success change fullname', async () => {
    const newFullname = 'newFullname';

    const newUserResponse = deepCopy(userResponse);
    newUserResponse['fullname'] = newFullname;

    const newUser = user.clone();
    newUser.setFullname(newFullname);

    mockUserRepository.changeFullname.mockResolvedValue(true);
    mockRedisService.set.mockResolvedValueOnce(newUserResponse);
    mockRedisService.set.mockResolvedValueOnce(newUserResponse);
    mockRedisService.set.mockResolvedValueOnce(newUserResponse);

    const result = await changeFullnameHandler.execute(
      new ChangeFullnameCommand(userResponse, {
        fullname: newFullname,
      }),
    );

    expect(result).toBeTruthy();
    expect(mockUserRepository.changeFullname).toHaveBeenCalledWith(newUser);
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

  it('Should fail change fullname with undefined fullname', async () => {
    mockUserRepository.changeFullname.mockResolvedValue(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);

    await expect(
      changeFullnameHandler.execute(
        new ChangeFullnameCommand(userResponse, {
          fullname: undefined,
        }),
      ),
    ).rejects.toThrow(new Error('New fullname cannot be undefined'));

    expect(mockUserRepository.changeFullname).not.toHaveBeenCalled();
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

  it('Should fail change fullname cause new fullname is the same as the older one', async () => {
    mockUserRepository.changeFullname.mockResolvedValue(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);

    await expect(
      changeFullnameHandler.execute(
        new ChangeFullnameCommand(userResponse, {
          fullname: fullname,
        }),
      ),
    ).rejects.toThrow(
      new Error('Fullname cannot be the same as the older one'),
    );

    expect(mockUserRepository.changeFullname).not.toHaveBeenCalled();
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
