import { Test, TestingModule } from '@nestjs/testing';

import { RedisService } from '@/shared/libs/redis/redis.service';

import { FindUserByIdHandler } from '../queries/find-user-by-id.handler';
import { UserRepository } from '../repositories/user.repository';
import { FindUserByIdQuery } from '../queries';

import {
  id,
  idPayload,
  mockRedisService,
  mockUserRepository,
  user,
  userId,
  userResponse,
} from './mock';
import { PGUserRepository } from '@/shared/libs/constant';

describe('Find User By Id', () => {
  let findUserByIdHandler: FindUserByIdHandler;
  let redisService: RedisService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserByIdHandler,
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
    findUserByIdHandler = module.get<FindUserByIdHandler>(FindUserByIdHandler);

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(userRepository).toBeDefined();
    expect(redisService).toBeDefined();
    expect(findUserByIdHandler).toBeDefined();
  });

  it('Should success find user by Id from redis', async () => {
    mockRedisService.get.mockResolvedValue(userResponse);
    mockUserRepository.findById.mockResolvedValue(null);
    mockRedisService.set.mockResolvedValue(null);

    const result = await findUserByIdHandler.execute(idPayload);

    expect(result).toEqual(userResponse);
    expect(mockRedisService.get).toHaveBeenCalledWith(`user with ${id}: `);
    expect(mockUserRepository.findById).not.toHaveBeenCalled();
    expect(mockRedisService.set).not.toHaveBeenCalled();
  });

  it('Should success find user by Id from database', async () => {
    mockRedisService.get.mockResolvedValue(null);
    mockUserRepository.findById.mockResolvedValue(user);
    mockRedisService.set.mockResolvedValue(userResponse);

    const result = await findUserByIdHandler.execute(idPayload);

    expect(result).toEqual(userResponse);
    expect(mockRedisService.get).toHaveBeenCalledWith(`user with ${id}: `);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockRedisService.set).toHaveBeenCalledWith(
      `user with ${id}: `,
      userResponse,
      60 * 60 * 24 * 30,
    );
  });

  it('Should fail find user by invalid id', async () => {
    const invalidPayload = idPayload;
    idPayload.id = 'test123';

    mockRedisService.get.mockResolvedValue(null);
    mockUserRepository.findById.mockResolvedValue(null);
    mockRedisService.set.mockResolvedValue(null);

    await expect(findUserByIdHandler.execute(invalidPayload)).rejects.toThrow(
      'Invalid UUID format',
    );

    expect(mockRedisService.get).toHaveBeenCalledWith(`user with test123: `);
    expect(mockUserRepository.findById).not.toHaveBeenCalledWith(userId);
    expect(mockRedisService.set).not.toHaveBeenCalledWith(
      `user with ${id}: `,
      userResponse,
      60 * 60 * 24 * 30,
    );
  });

  it('Should fail find user by cause id is undefined', async () => {
    mockRedisService.get.mockResolvedValue(null);
    mockUserRepository.findById.mockResolvedValue(null);
    mockRedisService.set.mockResolvedValue(null);

    const result = await findUserByIdHandler.execute(
      new FindUserByIdQuery(undefined),
    );

    expect(result).toBeNull();
    expect(mockRedisService.get).not.toHaveBeenCalledWith(
      `user with undefined: `,
    );
    expect(mockUserRepository.findById).not.toHaveBeenCalledWith(idPayload);
    expect(mockRedisService.set).not.toHaveBeenCalledWith(
      `user with ${id}: `,
      userResponse,
      60 * 60 * 24 * 30,
    );
  });
});
