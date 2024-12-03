import { Test, TestingModule } from '@nestjs/testing';

import { RedisService } from '@/shared/libs/redis/redis.service';
import { PGUserRepository } from '@/shared/libs/constant';
import { BcryptService } from '@/shared/libs/bcrypt';

import { UserRepository } from '../domain/repositories/user.repository';
import { ChangeEmailHandler } from '../application/commands/change-email.handler';
import {
  deepCopy,
  email,
  hashed_password,
  id,
  mockBcryptService,
  mockRedisService,
  mockUserRepository,
  password,
  phone_number,
  user,
  userResponse,
} from './mock';
import { ChangeEmailCommand } from '../application/commands';
import { Email } from '../domain/value-object/email';

describe('Change email Handler', () => {
  let userRepository: UserRepository;
  let bcryptService: BcryptService;
  let redisService: RedisService;
  let changeEmailHandler: ChangeEmailHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangeEmailHandler,
        {
          provide: BcryptService,
          useValue: mockBcryptService,
        },
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
    bcryptService = module.get<BcryptService>(BcryptService);
    redisService = module.get<RedisService>(RedisService);
    changeEmailHandler = module.get<ChangeEmailHandler>(ChangeEmailHandler);

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(userRepository).toBeDefined();
    expect(redisService).toBeDefined();
    expect(bcryptService).toBeDefined();
    expect(changeEmailHandler).toBeDefined();
  });

  it('Should success change email', async () => {
    const emails = 'arif@email.com';

    const newUserResponse = deepCopy(userResponse);
    newUserResponse['email'] = emails;

    const newUser = user.clone();
    newUser.setEmail(new Email(emails));

    mockBcryptService.comparePassword.mockResolvedValue(true);
    mockUserRepository.changeEmail.mockResolvedValue(true);
    mockRedisService.set.mockResolvedValueOnce(newUserResponse);
    mockRedisService.set.mockResolvedValueOnce(newUserResponse);
    mockRedisService.set.mockResolvedValueOnce(newUserResponse);

    const result = await changeEmailHandler.execute(
      new ChangeEmailCommand(userResponse, {
        email: emails,
        current_password: password,
      }),
    );

    expect(result).toBeTruthy();
    expect(mockBcryptService.comparePassword).toHaveBeenCalledWith(
      password,
      hashed_password,
    );
    expect(mockUserRepository.changeEmail).toHaveBeenCalledWith(newUser);
    expect(mockRedisService.set).toHaveBeenCalledTimes(3);
    expect(mockRedisService.set).toHaveBeenNthCalledWith(
      1,
      `user with ${emails}: `,
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

  it('Should fail change email with invalid email', async () => {
    const emails = 'arifemail.com';

    const newUserResponse = deepCopy(userResponse);
    newUserResponse['email'] = emails;

    mockBcryptService.comparePassword.mockResolvedValue(true);
    mockUserRepository.changeEmail.mockResolvedValue(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);

    await expect(
      changeEmailHandler.execute(
        new ChangeEmailCommand(userResponse, {
          email: emails,
          current_password: password,
        }),
      ),
    ).rejects.toThrow(new Error('Invalid email format'));

    expect(mockBcryptService.comparePassword).toHaveBeenCalledWith(
      password,
      hashed_password,
    );
    expect(mockUserRepository.changeEmail).not.toHaveBeenCalled();
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

  it('Should fail change email with undefined email', async () => {
    mockBcryptService.comparePassword.mockResolvedValue(false);
    mockUserRepository.changeEmail.mockResolvedValue(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);

    await expect(
      changeEmailHandler.execute(
        new ChangeEmailCommand(userResponse, {
          email: undefined,
          current_password: undefined,
        }),
      ),
    ).rejects.toThrow(new Error('New email/old password cannot be undefined'));

    expect(mockBcryptService.comparePassword).not.toHaveBeenCalledWith(
      password,
      hashed_password,
    );
    expect(mockUserRepository.changeEmail).not.toHaveBeenCalled();
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

  it('Should fail change email cause new email is the same as the older one', async () => {
    mockBcryptService.comparePassword.mockResolvedValue(true);
    mockUserRepository.changeEmail.mockResolvedValue(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);

    await expect(
      changeEmailHandler.execute(
        new ChangeEmailCommand(userResponse, {
          email: email,
          current_password: password,
        }),
      ),
    ).rejects.toThrow(new Error('Email cannot be the same as the older one'));

    expect(mockBcryptService.comparePassword).not.toHaveBeenCalledWith(
      password,
      hashed_password,
    );
    expect(mockUserRepository.changeEmail).not.toHaveBeenCalled();
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
