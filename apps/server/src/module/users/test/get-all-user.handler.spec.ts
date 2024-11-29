import { Test, TestingModule } from '@nestjs/testing';

import { GetAllUserHandler } from '../queries/get-all-user.handler';
import { UserRepository } from '../repositories/user.repository';

import {
  mockRedisService,
  mockUserRepository,
  user,
  userResponse,
} from './mock';
import { PGUserRepository } from '@/shared/libs/constant';
import { GetAllUserQuery } from '../queries';

describe('Find User By PhoneNumber', () => {
  let getAllUserhandler: GetAllUserHandler;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllUserHandler,
        {
          provide: PGUserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(PGUserRepository);
    getAllUserhandler = module.get<GetAllUserHandler>(GetAllUserHandler);

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(userRepository).toBeDefined();
    expect(getAllUserhandler).toBeDefined();
  });

  it('Should success find users', async () => {
    mockUserRepository.findAll.mockResolvedValue([user, user]);

    const result = await getAllUserhandler.execute(new GetAllUserQuery());

    expect(result).toEqual([userResponse, userResponse]);
    expect(mockUserRepository.findAll).toHaveBeenCalled();
  });

  it('Should success find users zero', async () => {
    mockUserRepository.findAll.mockResolvedValue([]);

    const result = await getAllUserhandler.execute(new GetAllUserQuery());

    expect(result).toEqual([]);
    expect(mockUserRepository.findAll).toHaveBeenCalled();
  });
});
