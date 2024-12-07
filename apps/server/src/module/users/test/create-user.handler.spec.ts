import { Test, TestingModule } from '@nestjs/testing';

import { RedisService } from '@/shared/libs/redis/redis.service';
import { ESUserRepository, PGUserRepository } from '@/shared/libs/constant';
import { BcryptService } from '@/shared/libs/bcrypt';

import { UserRepository } from '../domain/repositories/user.repository';
import { CreateUserHandler } from '../application/commands/create-user.handler';
import {
  email,
  fullname,
  hashed_password,
  id,
  mockBcryptService,
  mockRedisService,
  mockUserRepository,
  password,
  phone_number,
  registerPayload,
  user,
  userResponse,
} from './mock';

describe('Create User Handler', () => {
  let userRepository: UserRepository;
  let bcryptService: BcryptService;
  let redisService: RedisService;
  let createUserHandler: CreateUserHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        { provide: BcryptService, useValue: mockBcryptService },
        { provide: RedisService, useValue: mockRedisService },
        { provide: PGUserRepository, useValue: mockUserRepository },
        { provide: ESUserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(PGUserRepository);
    bcryptService = module.get<BcryptService>(BcryptService);
    redisService = module.get<RedisService>(RedisService);
    createUserHandler = module.get<CreateUserHandler>(CreateUserHandler);

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(userRepository).toBeDefined();
    expect(redisService).toBeDefined();
    expect(bcryptService).toBeDefined();
    expect(createUserHandler).toBeDefined();
  });

  it('Should success register user', async () => {
    mockBcryptService.hashPassword.mockResolvedValue(hashed_password);
    mockUserRepository.save.mockResolvedValue(user);
    mockRedisService.set.mockResolvedValueOnce(userResponse);
    mockRedisService.set.mockResolvedValueOnce(userResponse);
    mockRedisService.set.mockResolvedValueOnce(userResponse);

    const result = await createUserHandler.execute(registerPayload);

    expect(result).toEqual(userResponse);
    expect(mockBcryptService.hashPassword).toHaveBeenCalledWith(password);
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(mockRedisService.set).toHaveBeenCalledTimes(3);
    expect(mockRedisService.set).toHaveBeenNthCalledWith(
      1,
      `user with ${email}: `,
      userResponse,
      60 * 60 * 30 * 24,
    );
    expect(mockRedisService.set).toHaveBeenNthCalledWith(
      2,
      `user with ${id}: `,
      userResponse,
      60 * 60 * 30 * 24,
    );
    expect(mockRedisService.set).toHaveBeenNthCalledWith(
      3,
      `user with ${phone_number}: `,
      userResponse,
      60 * 60 * 30 * 24,
    );
  });

  it('Should fail register user with invalid email', async () => {
    const register = registerPayload;
    register.email = fullname;

    mockBcryptService.hashPassword.mockResolvedValue(null);
    mockUserRepository.save.mockResolvedValue(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);

    await expect(createUserHandler.execute(register)).rejects.toThrow(
      new Error('Invalid email format'),
    );

    expect(mockBcryptService.hashPassword).not.toHaveBeenCalledWith(password);
    expect(mockUserRepository.save).not.toHaveBeenCalled();
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
