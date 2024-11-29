import { Test, TestingModule } from '@nestjs/testing';

import { RedisService } from '@/shared/libs/redis/redis.service';

import { FindUserByEmailHandler } from '../queries/find-user-by-email.handler';
import { UserRepository } from '../repositories/user.repository';
import { FindUserByEmailQuery } from '../queries';

import {
  email,
  emailPayload,
  mockRedisService,
  mockUserRepository,
  user,
  userResponse,
  validEmail,
} from './mock';
import { PGUserRepository } from '@/shared/libs/constant';

describe('Find User By Email', () => {
  let findUserByEmailHandler: FindUserByEmailHandler;
  let redisService: RedisService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserByEmailHandler,
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
    findUserByEmailHandler = module.get<FindUserByEmailHandler>(
      FindUserByEmailHandler,
    );

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(userRepository).toBeDefined();
    expect(redisService).toBeDefined();
    expect(findUserByEmailHandler).toBeDefined();
  });

  it('Should success find user by email from redis', async () => {
    mockRedisService.get.mockResolvedValue(userResponse);
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockRedisService.set.mockResolvedValue(null);

    const result = await findUserByEmailHandler.execute(emailPayload);

    expect(result).toEqual(userResponse);
    expect(mockRedisService.get).toHaveBeenCalledWith(`user with ${email}: `);
    expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
    expect(mockRedisService.set).not.toHaveBeenCalled();
  });

  it('Should success find user by email from database', async () => {
    mockRedisService.get.mockResolvedValue(null);
    mockUserRepository.findByEmail.mockResolvedValue(user);
    mockRedisService.set.mockResolvedValue(userResponse);

    const result = await findUserByEmailHandler.execute(emailPayload);

    expect(result).toEqual(userResponse);
    expect(mockRedisService.get).toHaveBeenCalledWith(`user with ${email}: `);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(validEmail);
    expect(mockRedisService.set).toHaveBeenCalledWith(
      `user with ${email}: `,
      userResponse,
      60 * 60 * 24 * 30,
    );
  });

  it('Should fail find user by invalid email', async () => {
    const invalidPayload = emailPayload;
    emailPayload.email = 'test123';

    mockRedisService.get.mockResolvedValue(null);
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockRedisService.set.mockResolvedValue(null);

    await expect(
      findUserByEmailHandler.execute(invalidPayload),
    ).rejects.toThrow('Invalid email format');

    expect(mockRedisService.get).toHaveBeenCalledWith(`user with test123: `);
    expect(mockUserRepository.findByEmail).not.toHaveBeenCalledWith(validEmail);
    expect(mockRedisService.set).not.toHaveBeenCalledWith(
      `user with ${email}: `,
      userResponse,
      60 * 60 * 24 * 30,
    );
  });

  it('Should fail find user by cause email is undefined', async () => {
    mockRedisService.get.mockResolvedValue(null);
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockRedisService.set.mockResolvedValue(null);

    await expect(
      findUserByEmailHandler.execute(new FindUserByEmailQuery(undefined)),
    ).rejects.toThrow('Email constructor called with undefined');

    expect(mockRedisService.get).toHaveBeenCalledWith(`user with undefined: `);
    expect(mockUserRepository.findByEmail).not.toHaveBeenCalledWith(validEmail);
    expect(mockRedisService.set).not.toHaveBeenCalledWith(
      `user with ${email}: `,
      userResponse,
      60 * 60 * 24 * 30,
    );
  });
});
