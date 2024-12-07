import { Test, TestingModule } from '@nestjs/testing';

import { RedisService } from '@/shared/libs/redis/redis.service';
import { ESUserRepository, PGUserRepository } from '@/shared/libs/constant';
import { BcryptService } from '@/shared/libs/bcrypt';

import { UserRepository } from '../domain/repositories/user.repository';
import { ChangePhoneNumberHandler } from '../application/commands/change-phone-number.handler';
import {
  deepCopy,
  id,
  mockBcryptService,
  mockRedisService,
  mockUserRepository,
  phone_number,
  user,
  userResponse,
  email,
  password,
  hashed_password,
  created_at,
  updated_at,
} from './mock';
import { ChangePhoneNumberCommand } from '../application/commands';

describe('Change PhoneNumber Handler', () => {
  let userRepository: UserRepository;
  let bcryptService: BcryptService;
  let redisService: RedisService;
  let changePhoneNumberHandler: ChangePhoneNumberHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangePhoneNumberHandler,
        { provide: BcryptService, useValue: mockBcryptService },
        { provide: RedisService, useValue: mockRedisService },
        { provide: PGUserRepository, useValue: mockUserRepository },
        { provide: ESUserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(PGUserRepository);
    bcryptService = module.get<BcryptService>(BcryptService);
    redisService = module.get<RedisService>(RedisService);
    changePhoneNumberHandler = module.get<ChangePhoneNumberHandler>(
      ChangePhoneNumberHandler,
    );

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(userRepository).toBeDefined();
    expect(redisService).toBeDefined();
    expect(bcryptService).toBeDefined();
    expect(changePhoneNumberHandler).toBeDefined();
  });

  it('Should success change PhoneNumber', async () => {
    const newPhoneNumber = '12345678';

    const newUserResponse = deepCopy(userResponse);
    newUserResponse['phone_number'] = newPhoneNumber;
    newUserResponse['created_at'] = created_at;
    newUserResponse['updated_at'] = updated_at;

    const newUser = user.clone();
    newUser.setPhoneNumber(newPhoneNumber);

    mockBcryptService.comparePassword.mockResolvedValue(true);
    mockUserRepository.changePhoneNumber.mockResolvedValue(true);
    mockRedisService.set.mockResolvedValueOnce(newUserResponse);
    mockRedisService.set.mockResolvedValueOnce(newUserResponse);
    mockRedisService.set.mockResolvedValueOnce(newUserResponse);

    const result = await changePhoneNumberHandler.execute(
      new ChangePhoneNumberCommand(userResponse, {
        phone_number: newPhoneNumber,
        current_password: password,
      }),
    );

    expect(result).toBeTruthy();
    expect(mockBcryptService.comparePassword).toHaveBeenCalledWith(
      password,
      hashed_password,
    );
    expect(mockUserRepository.changePhoneNumber).toHaveBeenCalledWith(newUser);
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
      `user with ${newPhoneNumber}: `,
      newUserResponse,
      60 * 60 * 30 * 24,
    );
  });

  it('Should fail change phone number with undefined old password/new phone number', async () => {
    mockBcryptService.comparePassword.mockResolvedValue(null);
    mockUserRepository.changePhoneNumber.mockResolvedValue(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);

    await expect(
      changePhoneNumberHandler.execute(
        new ChangePhoneNumberCommand(userResponse, {
          phone_number: undefined,
          current_password: undefined,
        }),
      ),
    ).rejects.toThrow(
      new Error('New phone number/old password cannot be undefined'),
    );

    expect(mockBcryptService.comparePassword).not.toHaveBeenCalledWith(
      password,
      hashed_password,
    );
    expect(mockUserRepository.changePhoneNumber).not.toHaveBeenCalled();
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

  it('Should fail change PhoneNumber cause new PhoneNumber is the same as the older one', async () => {
    mockBcryptService.comparePassword.mockResolvedValue(null);
    mockUserRepository.changePhoneNumber.mockResolvedValue(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);
    mockRedisService.set.mockResolvedValueOnce(null);

    await expect(
      changePhoneNumberHandler.execute(
        new ChangePhoneNumberCommand(userResponse, {
          phone_number: phone_number,
          current_password: password,
        }),
      ),
    ).rejects.toThrow(
      new Error('phone number cannot be the same as the older one'),
    );

    expect(mockBcryptService.comparePassword).not.toHaveBeenCalledWith(
      password,
      hashed_password,
    );
    expect(mockUserRepository.changePhoneNumber).not.toHaveBeenCalled();
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
