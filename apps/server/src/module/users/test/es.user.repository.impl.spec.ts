import { Test, TestingModule } from '@nestjs/testing';

import { SearchService } from '@/shared/libs/elastic/search.service';
import {
  createMockByWriteResponse,
  createMockElasticResponse,
} from '@/shared/mocks/mock-elastic-result';

import { UserResponse } from '../application/response/user.reponse';
import { ESUserRepositoryImpl } from '../infrastructure/repositories/es.user.repository.impl';

import {
  email,
  fullname,
  hashed_password,
  id,
  mockElasticService,
  phone_number,
  query,
  user,
  userId,
  userResponse,
  validEmail,
} from './mock';

describe('ES User Repository', () => {
  let esUserRepository: ESUserRepositoryImpl;
  let searchService: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ESUserRepositoryImpl,
        { provide: SearchService, useValue: mockElasticService },
      ],
    }).compile();

    searchService = module.get<SearchService>(SearchService);
    esUserRepository = module.get<ESUserRepositoryImpl>(ESUserRepositoryImpl);

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(esUserRepository).toBeDefined();
    expect(searchService).toBeDefined();
  });

  describe('Save user', () => {
    it('Should success save user', async () => {
      const mockElasticResult = createMockElasticResponse<UserResponse>(
        [userResponse],
        1,
        1,
      );

      mockElasticService.index.mockResolvedValue(mockElasticResult);

      const result = await esUserRepository.save(user);

      expect(result).toEqual(user);
      expect(mockElasticService.index).toHaveBeenCalledWith(
        'users',
        id,
        userResponse,
      );
    });

    it('Should fail save user', async () => {
      const mockElasticResult = createMockElasticResponse<UserResponse>(
        [],
        0,
        0,
      );

      mockElasticService.index.mockResolvedValue(mockElasticResult);

      const result = await esUserRepository.save(user);

      expect(result).toEqual(null);
      expect(mockElasticService.index).toHaveBeenCalledWith(
        'users',
        id,
        userResponse,
      );
    });
  });

  describe('Find User by email', () => {
    it('Should success find user by email', async () => {
      const mockElasticResult = createMockElasticResponse<UserResponse>(
        [userResponse],
        1,
        1,
      );
      const queries = query;
      queries['match'] = {
        email: email,
      };

      mockElasticService.searchExact.mockResolvedValue(mockElasticResult);

      const result = await esUserRepository.findByEmail(validEmail);

      expect(result).toEqual(user);
      expect(mockElasticService.searchExact).toHaveBeenCalledWith(
        'users',
        queries,
      );
    });

    it('Should fail find user by email', async () => {
      const mockElasticResult = createMockElasticResponse<UserResponse>(
        [],
        0,
        0,
      );
      const queries = query;
      queries['match'] = {
        email: email,
      };

      mockElasticService.searchExact.mockResolvedValue(mockElasticResult);

      const result = await esUserRepository.findByEmail(validEmail);

      expect(result).toBeNull();
      expect(mockElasticService.searchExact).toHaveBeenCalledWith(
        'users',
        queries,
      );
    });
  });

  describe('Find User by id', () => {
    it('Should success find user by id', async () => {
      const mockElasticResult = createMockElasticResponse<UserResponse>(
        [userResponse],
        1,
        1,
      );
      const queries = query;
      queries['match'] = {
        id: id,
      };

      mockElasticService.searchExact.mockResolvedValue(mockElasticResult);

      const result = await esUserRepository.findById(userId);

      expect(result).toEqual(user);
      expect(mockElasticService.searchExact).toHaveBeenCalledWith(
        'users',
        queries,
      );
    });

    it('Should fail find user by id', async () => {
      const mockElasticResult = createMockElasticResponse<UserResponse>(
        [],
        0,
        0,
      );
      const queries = query;
      queries['match'] = {
        id: id,
      };

      mockElasticService.searchExact.mockResolvedValue(mockElasticResult);

      const result = await esUserRepository.findById(userId);

      expect(result).toBeNull();
      expect(mockElasticService.searchExact).toHaveBeenCalledWith(
        'users',
        queries,
      );
    });
  });

  describe('Find User by phone number', () => {
    it('Should success find user by phone number', async () => {
      const mockElasticResult = createMockElasticResponse<UserResponse>(
        [userResponse],
        1,
        1,
      );
      const queries = query;
      queries['match'] = {
        phone_number: phone_number,
      };

      mockElasticService.searchExact.mockResolvedValue(mockElasticResult);

      const result = await esUserRepository.findByPhoneNumber(phone_number);

      expect(result).toEqual(user);
      expect(mockElasticService.searchExact).toHaveBeenCalledWith(
        'users',
        queries,
      );
    });

    it('Should fail find user by phone number', async () => {
      const mockElasticResult = createMockElasticResponse<UserResponse>(
        [],
        0,
        0,
      );
      const queries = query;
      queries['match'] = {
        phone_number: phone_number,
      };

      mockElasticService.searchExact.mockResolvedValue(mockElasticResult);

      const result = await esUserRepository.findByPhoneNumber(phone_number);

      expect(result).toBeNull();
      expect(mockElasticService.searchExact).toHaveBeenCalledWith(
        'users',
        queries,
      );
    });
  });

  describe('Delete user', () => {
    it('Should success delete user', async () => {
      const mockResponse = createMockByWriteResponse(
        id,
        'users',
        'deleted',
        1,
        1,
        0,
      );

      mockElasticService.delete.mockResolvedValue(mockResponse);

      const result = await esUserRepository.delete(user);

      expect(result).toBeTruthy();
      expect(mockElasticService.delete).toHaveBeenCalledWith('users', id);
    });

    it('Should fail delete user', async () => {
      const mockResponse = createMockByWriteResponse(
        id,
        'users',
        'not_found',
        0,
        0,
        0,
      );

      mockElasticService.delete.mockResolvedValue(mockResponse);

      const result = await esUserRepository.delete(user);

      expect(result).toBeFalsy();
      expect(mockElasticService.delete).toHaveBeenCalledWith('users', id);
    });
  });

  describe('Update user', () => {
    it('Should success update user', async () => {
      const mockResponse = createMockByWriteResponse(
        id,
        'users',
        'updated',
        1,
        1,
        0,
      );

      mockElasticService.update.mockResolvedValue(mockResponse);

      const result = await esUserRepository.update(user);

      expect(result).toBeTruthy();
      expect(mockElasticService.update).toHaveBeenCalledWith(
        'users',
        id,
        userResponse,
      );
    });

    it('Should fail update user', async () => {
      const mockResponse = createMockByWriteResponse(
        id,
        'users',
        'not_found',
        0,
        0,
        0,
      );

      mockElasticService.update.mockResolvedValue(mockResponse);

      const result = await esUserRepository.update(user);

      expect(result).toBeFalsy();
      expect(mockElasticService.update).toHaveBeenCalledWith(
        'users',
        id,
        userResponse,
      );
    });
  });

  describe('Change email', () => {
    it('Should success change email', async () => {
      const mockResponse = createMockByWriteResponse(
        id,
        'users',
        'updated',
        1,
        1,
        0,
      );

      mockElasticService.update.mockResolvedValue(mockResponse);

      const result = await esUserRepository.changeEmail(user);

      expect(result).toBeTruthy();
      expect(mockElasticService.update).toHaveBeenCalledWith('users', id, {
        email: email,
      });
    });

    it('Should fail change email', async () => {
      const mockResponse = createMockByWriteResponse(
        id,
        'users',
        'not_found',
        0,
        0,
        0,
      );

      mockElasticService.update.mockResolvedValue(mockResponse);

      const result = await esUserRepository.changeEmail(user);

      expect(result).toBeFalsy();
      expect(mockElasticService.update).toHaveBeenCalledWith('users', id, {
        email: email,
      });
    });
  });

  describe('Change Fullname', () => {
    it('Should success change fullname', async () => {
      const mockResponse = createMockByWriteResponse(
        id,
        'users',
        'updated',
        1,
        1,
        0,
      );

      mockElasticService.update.mockResolvedValue(mockResponse);

      const result = await esUserRepository.changeFullname(user);

      expect(result).toBeTruthy();
      expect(mockElasticService.update).toHaveBeenCalledWith('users', id, {
        fullname: fullname,
      });
    });

    it('Should fail change fullname', async () => {
      const mockResponse = createMockByWriteResponse(
        id,
        'users',
        'not_found',
        0,
        0,
        0,
      );

      mockElasticService.update.mockResolvedValue(mockResponse);

      const result = await esUserRepository.changeFullname(user);

      expect(result).toBeFalsy();
      expect(mockElasticService.update).toHaveBeenCalledWith('users', id, {
        fullname: fullname,
      });
    });
  });

  describe('Change Password', () => {
    it('Should success change password', async () => {
      const mockResponse = createMockByWriteResponse(
        id,
        'users',
        'updated',
        1,
        1,
        0,
      );

      mockElasticService.update.mockResolvedValue(mockResponse);

      const result = await esUserRepository.changePassword(user);

      expect(result).toBeTruthy();
      expect(mockElasticService.update).toHaveBeenCalledWith('users', id, {
        password: hashed_password,
      });
    });

    it('Should fail change password', async () => {
      const mockResponse = createMockByWriteResponse(
        id,
        'users',
        'not_found',
        0,
        0,
        0,
      );

      mockElasticService.update.mockResolvedValue(mockResponse);

      const result = await esUserRepository.changePassword(user);

      expect(result).toBeFalsy();
      expect(mockElasticService.update).toHaveBeenCalledWith('users', id, {
        password: hashed_password,
      });
    });
  });

  describe('Update Provider', () => {
    it('Should success update provider', async () => {
      const mockResponse = createMockByWriteResponse(
        id,
        'users',
        'updated',
        1,
        1,
        0,
      );

      mockElasticService.update.mockResolvedValue(mockResponse);

      const result = await esUserRepository.updateProvider(user);

      expect(result).toBeTruthy();
      expect(mockElasticService.update).toHaveBeenCalledWith('users', id, {
        provider: 'local',
      });
    });

    it('Should fail update provider', async () => {
      const mockResponse = createMockByWriteResponse(
        id,
        'users',
        'not_found',
        0,
        0,
        0,
      );

      mockElasticService.update.mockResolvedValue(mockResponse);

      const result = await esUserRepository.updateProvider(user);

      expect(result).toBeFalsy();
      expect(mockElasticService.update).toHaveBeenCalledWith('users', id, {
        provider: 'local',
      });
    });
  });

  describe('Verify User', () => {
    it('Should success verify user', async () => {
      const mockResponse = createMockByWriteResponse(
        id,
        'users',
        'updated',
        1,
        1,
        0,
      );

      mockElasticService.update.mockResolvedValue(mockResponse);

      const result = await esUserRepository.verifyUser(user);

      expect(result).toBeTruthy();
      expect(mockElasticService.update).toHaveBeenCalledWith('users', id, {
        is_verified: false,
      });
    });

    it('Should fail verify user', async () => {
      const mockResponse = createMockByWriteResponse(
        id,
        'users',
        'not_found',
        0,
        0,
        0,
      );

      mockElasticService.update.mockResolvedValue(mockResponse);

      const result = await esUserRepository.verifyUser(user);

      expect(result).toBeFalsy();
      expect(mockElasticService.update).toHaveBeenCalledWith('users', id, {
        is_verified: false,
      });
    });
  });

  describe('lock account', () => {
    it('Should success lock account', async () => {
      const mockResponse = createMockByWriteResponse(
        id,
        'users',
        'updated',
        1,
        1,
        0,
      );

      mockElasticService.update.mockResolvedValue(mockResponse);

      const result = await esUserRepository.lockAccount(user);

      expect(result).toBeTruthy();
      expect(mockElasticService.update).toHaveBeenCalledWith('users', id, {
        is_account_non_locked: true,
        is_account_non_expired: true,
      });
    });

    it('Should fail lock account', async () => {
      const mockResponse = createMockByWriteResponse(
        id,
        'users',
        'not_found',
        0,
        0,
        0,
      );

      mockElasticService.update.mockResolvedValue(mockResponse);

      const result = await esUserRepository.lockAccount(user);

      expect(result).toBeFalsy();
      expect(mockElasticService.update).toHaveBeenCalledWith('users', id, {
        is_account_non_locked: true,
        is_account_non_expired: true,
      });
    });
  });

  describe('Filter user', () => {
    it('Should success filter user', async () => {
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

      mockElasticService.search.mockResolvedValue(paginationResponse);

      const result = await esUserRepository.filterBy({ email: validEmail });

      expect(result).toEqual(paginationDomain);
      expect(mockElasticService.search).toHaveBeenCalledWith(
        'users',
        query,
        0,
        10,
        {},
      );
    });

    it('Should success filter user return zero', async () => {
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

      mockElasticService.search.mockResolvedValue(paginationResponse);

      const result = await esUserRepository.filterBy({ email: validEmail });

      expect(result).toEqual(paginationDomain);
      expect(mockElasticService.search).toHaveBeenCalledWith(
        'users',
        query,
        0,
        10,
        {},
      );
    });
  });
});
