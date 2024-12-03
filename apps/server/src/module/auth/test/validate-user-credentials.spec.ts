import { Test, TestingModule } from '@nestjs/testing';

import { BcryptService } from '@/shared/libs/bcrypt';
import {
  hashed_password,
  mockBcryptService,
  password,
  userResponse,
} from '@/module/users/test/mock';

import { ValidateUserCredentials } from '../service/validate-user-credentials';

describe('Validate USer Credentials', () => {
  let validateUserCredentials: ValidateUserCredentials;
  let bcryptService: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateUserCredentials,
        {
          provide: BcryptService,
          useValue: mockBcryptService,
        },
      ],
    }).compile();

    bcryptService = module.get<BcryptService>(BcryptService);
    validateUserCredentials = module.get<ValidateUserCredentials>(
      ValidateUserCredentials,
    );

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(bcryptService).toBeDefined();
    expect(validateUserCredentials).toBeDefined();
  });

  it('Should success validate credentials', async () => {
    mockBcryptService.comparePassword.mockResolvedValue(true);

    const result = await validateUserCredentials.execute({
      user: userResponse,
      password: password,
    });

    expect(result).toBeTruthy();
    expect(mockBcryptService.comparePassword).toHaveBeenCalledWith(
      password,
      hashed_password,
    );
  });

  it('Should fail validate credentials', async () => {
    mockBcryptService.comparePassword.mockResolvedValue(false);

    const result = await validateUserCredentials.execute({
      user: userResponse,
      password: password,
    });

    expect(result).toBeFalsy();
    expect(mockBcryptService.comparePassword).toHaveBeenCalledWith(
      password,
      hashed_password,
    );
  });
});
