import { Test, TestingModule } from '@nestjs/testing';

import { RedisService } from '@/shared/libs/redis/redis.service';
import { PGUserRepository } from '@/shared/libs/constant';
import { BcryptService } from '@/shared/libs/bcrypt';

import { UserRepository } from '../domain/repositories/user.repository';
import { ChangePasswordHandler } from '../application/commands/change-Password.handler';
import {
  deepCopy,
  hashed_password,
  id,
  mockBcryptService,
  mockRedisService,
  mockUserRepository,
  password,
  phone_number,
  user,
  userResponse,
  email,
} from './mock';
import { ChangePasswordCommand } from '../application/commands';

describe('Change Password Handler', () => {
  let userRepository: UserRepository;
  let bcryptService: BcryptService;
  let redisService: RedisService;
  let changePasswordHandler: ChangePasswordHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangePasswordHandler,
        { provide: BcryptService, useValue: mockBcryptService },
        { provide: RedisService, useValue: mockRedisService },
        { provide: PGUserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(PGUserRepository);
    bcryptService = module.get<BcryptService>(BcryptService);
    redisService = module.get<RedisService>(RedisService);
    changePasswordHandler = module.get<ChangePasswordHandler>(
      ChangePasswordHandler,
    );

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(userRepository).toBeDefined();
    expect(redisService).toBeDefined();
    expect(bcryptService).toBeDefined();
    expect(changePasswordHandler).toBeDefined();
  });

  it('Should success change password', async () => {
    const newPassword = 'arif@Password.com';

    const newUserResponse = deepCopy(userResponse);
    newUserResponse['password'] = hashed_password;

    const newUser = user.clone();
    newUser.setPassword(hashed_password);

    mockBcryptService.comparePassword.mockResolvedValue(true);
    mockBcryptService.hashPassword.mockResolvedValue(hashed_password);
    mockUserRepository.changePassword.mockResolvedValue(true);
    mockRedisService.set.mockResolvedValueOnce(newUserResponse);
    mockRedisService.set.mockResolvedValueOnce(newUserResponse);
    mockRedisService.set.mockResolvedValueOnce(newUserResponse);

    const result = await changePasswordHandler.execute(
      new ChangePasswordCommand(userResponse, {
        password: newPassword,
        current_password: password,
      }),
    );

    expect(result).toBeTruthy();
    expect(mockBcryptService.comparePassword).toHaveBeenCalledWith(
      password,
      hashed_password,
    );
    expect(mockBcryptService.hashPassword).toHaveBeenCalledWith(newPassword);
    expect(mockUserRepository.changePassword).toHaveBeenCalledWith(newUser);
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

  it('Should fail change Password with undefined old password/newpassword', async () => {
    mockBcryptService.comparePassword.mockResolvedValue(null);
    mockBcryptService.hashPassword.mockResolvedValue(null);
    mockUserRepository.changePassword.mockResolvedValue(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);

    await expect(
      changePasswordHandler.execute(
        new ChangePasswordCommand(userResponse, {
          password: undefined,
          current_password: undefined,
        }),
      ),
    ).rejects.toThrow(
      new Error('New password/old password cannot be undefined'),
    );

    expect(mockBcryptService.comparePassword).not.toHaveBeenCalledWith(
      password,
      hashed_password,
    );
    expect(mockBcryptService.hashPassword).not.toHaveBeenCalledWith(password);
    expect(mockUserRepository.changePassword).not.toHaveBeenCalled();
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

  it('Should fail change Password cause new Password is the same as the older one', async () => {
    mockBcryptService.comparePassword.mockResolvedValue(null);
    mockBcryptService.hashPassword.mockResolvedValue(null);
    mockUserRepository.changePassword.mockResolvedValue(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);

    await expect(
      changePasswordHandler.execute(
        new ChangePasswordCommand(userResponse, {
          password: password,
          current_password: password,
        }),
      ),
    ).rejects.toThrow(
      new Error('Password cannot be the same as the older one'),
    );

    expect(mockBcryptService.comparePassword).not.toHaveBeenCalledWith(
      password,
      hashed_password,
    );
    expect(mockBcryptService.hashPassword).not.toHaveBeenCalledWith(
      password,
      hashed_password,
    );
    expect(mockUserRepository.changePassword).not.toHaveBeenCalled();
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
