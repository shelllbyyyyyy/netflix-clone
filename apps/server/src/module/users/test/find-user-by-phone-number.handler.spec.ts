import { Test, TestingModule } from '@nestjs/testing';

import { RedisService } from '@/shared/libs/redis/redis.service';

import { FindUserByPhoneNumberHandler } from '../application/queries/find-user-by-phone-number.handler';
import { UserRepository } from '../domain/repositories/user.repository';
import { FindUserByPhoneNumberQuery } from '../application/queries';

import {
  phone_number,
  phoneNumberPayload,
  mockRedisService,
  mockUserRepository,
  user,
  userResponse,
} from './mock';
import { PGUserRepository } from '@/shared/libs/constant';

describe('Find User By PhoneNumber', () => {
  let findUserByPhoneNumberHandler: FindUserByPhoneNumberHandler;
  let redisService: RedisService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserByPhoneNumberHandler,
        { provide: RedisService, useValue: mockRedisService },
        { provide: PGUserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(PGUserRepository);
    redisService = module.get<RedisService>(RedisService);
    findUserByPhoneNumberHandler = module.get<FindUserByPhoneNumberHandler>(
      FindUserByPhoneNumberHandler,
    );

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(userRepository).toBeDefined();
    expect(redisService).toBeDefined();
    expect(findUserByPhoneNumberHandler).toBeDefined();
  });

  it('Should success find user by phone number from redis', async () => {
    mockRedisService.get.mockResolvedValue(userResponse);
    mockUserRepository.findByPhoneNumber.mockResolvedValue(null);
    mockRedisService.set.mockResolvedValue(null);

    const result =
      await findUserByPhoneNumberHandler.execute(phoneNumberPayload);

    expect(result).toEqual(userResponse);
    expect(mockRedisService.get).toHaveBeenCalledWith(
      `user with ${phone_number}: `,
    );
    expect(mockUserRepository.findByPhoneNumber).not.toHaveBeenCalled();
    expect(mockRedisService.set).not.toHaveBeenCalled();
  });

  it('Should success find user by phone number from database', async () => {
    mockRedisService.get.mockResolvedValue(null);
    mockUserRepository.findByPhoneNumber.mockResolvedValue(user);
    mockRedisService.set.mockResolvedValue(userResponse);

    const result =
      await findUserByPhoneNumberHandler.execute(phoneNumberPayload);

    expect(result).toEqual(userResponse);
    expect(mockRedisService.get).toHaveBeenCalledWith(
      `user with ${phone_number}: `,
    );
    expect(mockUserRepository.findByPhoneNumber).toHaveBeenCalledWith(
      phone_number,
    );
    expect(mockRedisService.set).toHaveBeenCalledWith(
      `user with ${phone_number}: `,
      userResponse,
      60 * 60 * 24 * 30,
    );
  });

  it('Should fail find user by phone number undefined', async () => {
    mockRedisService.get.mockResolvedValue(null);
    mockUserRepository.findByPhoneNumber.mockResolvedValue(null);
    mockRedisService.set.mockResolvedValue(null);

    const result = await findUserByPhoneNumberHandler.execute(
      new FindUserByPhoneNumberQuery(undefined),
    );

    expect(result).toBeNull;
    expect(mockRedisService.get).not.toHaveBeenCalledWith(
      `user with test123: `,
    );
    expect(mockUserRepository.findByPhoneNumber).not.toHaveBeenCalledWith(
      phone_number,
    );
    expect(mockRedisService.set).not.toHaveBeenCalledWith(
      `user with ${phone_number}: `,
      userResponse,
      60 * 60 * 24 * 30,
    );
  });
});
