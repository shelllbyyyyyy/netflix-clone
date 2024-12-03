import { Test, TestingModule } from '@nestjs/testing';

import { ESUserRepository } from '@/shared/libs/constant';

import { FindUserByFilterhandler } from '../application/queries/find-user-by-filter.handler';
import { UserRepository } from '../domain/repositories/user.repository';
import {
  email,
  mockUserRepository,
  user,
  userResponse,
  validEmail,
} from './mock';

describe('Find user by filter', () => {
  let findUserByFilterHandler: FindUserByFilterhandler;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserByFilterhandler,
        { provide: ESUserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    findUserByFilterHandler = module.get<FindUserByFilterhandler>(
      FindUserByFilterhandler,
    );
    userRepository = module.get<UserRepository>(ESUserRepository);

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(findUserByFilterHandler).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('Should success find user by filter', async () => {
    const paginationResponse = {
      data: [userResponse],
      page: 1,
      limit: 10,
      total: 1,
      total_pages: 1,
    };

    const paginationDomain = {
      data: [user],
      page: 1,
      limit: 10,
      total: 1,
      total_pages: 1,
    };

    const query: any = {
      bool: {
        should: [],
        filter: [],
      },
    };
    query.bool.should.push({
      match: {
        email: email,
      },
    });

    mockUserRepository.filterBy.mockResolvedValue(paginationDomain);

    const result = await findUserByFilterHandler.execute({ email: email });

    expect(result).toEqual(paginationResponse);
    expect(mockUserRepository.filterBy).toHaveBeenCalledWith({
      created_at: undefined,
      created_at_end: undefined,
      created_at_start: undefined,
      fullname: undefined,
      id: null,
      is_verified: undefined,
      limit: undefined,
      offset: undefined,
      order_by: undefined,
      phone_number: undefined,
      profile_id: undefined,
      email: validEmail,
    });
  });
  it('Should success find user by filter return zero', async () => {
    const paginationResponse = {
      data: [],
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 1,
    };

    const paginationDomain = {
      data: [],
      page: 1,
      limit: 10,
      total: 0,
      total_pages: 1,
    };

    const query: any = {
      bool: {
        should: [],
        filter: [],
      },
    };
    query.bool.should.push({
      match: {
        email: email,
      },
    });

    mockUserRepository.filterBy.mockResolvedValue(paginationDomain);

    const result = await findUserByFilterHandler.execute({ email: email });

    expect(result).toEqual(paginationResponse);
    expect(mockUserRepository.filterBy).toHaveBeenCalledWith({
      created_at: undefined,
      created_at_end: undefined,
      created_at_start: undefined,
      fullname: undefined,
      id: null,
      is_verified: undefined,
      limit: undefined,
      offset: undefined,
      order_by: undefined,
      phone_number: undefined,
      profile_id: undefined,
      email: validEmail,
    });
  });
});
