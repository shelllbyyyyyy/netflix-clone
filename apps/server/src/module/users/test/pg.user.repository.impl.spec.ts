import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseService } from '@/shared/libs/pg/database.service';
import { createMockQueryResult } from '@/shared/mocks/mock-query-result';

import { PGUserRepositoryImpl } from '../infrastructure/repositories/pg.user.repository.impl';
import {
  fullname,
  mockDatabaseService,
  paginationUserEntity,
  phone_number,
  user,
  userId,
  userResponse,
  validEmail,
} from './mock';

describe('PG User Repository', () => {
  let pgUserRepository: PGUserRepositoryImpl;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PGUserRepositoryImpl,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    pgUserRepository = module.get<PGUserRepositoryImpl>(PGUserRepositoryImpl);
    databaseService = module.get<DatabaseService>(DatabaseService);

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(pgUserRepository).toBeDefined();
    expect(databaseService).toBeDefined();
  });

  describe('Save user', () => {
    it('Should success save user', async () => {
      const mockQueryResult = createMockQueryResult(
        [userResponse],
        'INSERT',
        [],
        1,
      );
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.save(user);

      expect(result).toEqual(user);
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });

    it('Should fail save user', async () => {
      const mockQueryResult = createMockQueryResult([], 'INSERT', [], 0);
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.save(user);

      expect(result).toBeNull();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });
  });

  describe('Find user by email', () => {
    it('Should success find user by email', async () => {
      const mockQueryResult = createMockQueryResult(
        [userResponse],
        'SELECT',
        [],
        1,
      );
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.findByEmail(validEmail);

      expect(result).toEqual(user);
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });

    it('Should fail find user by email', async () => {
      const mockQueryResult = createMockQueryResult([], 'SELECT', [], 0);
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.findByEmail(validEmail);

      expect(result).toBeNull();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });
  });

  describe('Find user by id', () => {
    it('Should success find user by id', async () => {
      const mockQueryResult = createMockQueryResult(
        [userResponse],
        'SELECT',
        [],
        1,
      );
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.findById(userId);

      expect(result).toEqual(user);
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });

    it('Should fail find user by id', async () => {
      const mockQueryResult = createMockQueryResult([], 'SELECT', [], 0);
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.findById(userId);

      expect(result).toBeNull();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });
  });

  describe('Find user by phone number', () => {
    it('Should success find user by phone number', async () => {
      const mockQueryResult = createMockQueryResult(
        [userResponse],
        'SELECT',
        [],
        1,
      );
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.findByPhoneNumber(phone_number);

      expect(result).toEqual(user);
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });

    it('Should fail find user by phone number', async () => {
      const mockQueryResult = createMockQueryResult([], 'SELECT', [], 0);
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.findByPhoneNumber(phone_number);

      expect(result).toBeNull();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });
  });

  describe('Delete user', () => {
    it('Should success delete user', async () => {
      const mockQueryResult = createMockQueryResult([], 'DELETE', [], 1);
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.delete(user);

      expect(result).toBeTruthy();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });

    it('Should fail delete user', async () => {
      const mockQueryResult = createMockQueryResult([], 'DELETE', [], 0);
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.delete(user);

      expect(result).toBeFalsy();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });
  });

  describe('Update user', () => {
    it('Should success update user', async () => {
      const mockQueryResult = createMockQueryResult(
        [userResponse],
        'UPDATE',
        [],
        1,
      );
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.update(user);

      expect(result).toBeTruthy();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });

    it('Should fail update user', async () => {
      const mockQueryResult = createMockQueryResult([], 'UPDATE', [], 0);
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.delete(user);

      expect(result).toBeFalsy();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });
  });

  describe('Change Email', () => {
    it('Should success change email', async () => {
      const mockQueryResult = createMockQueryResult(
        [userResponse],
        'UPDATE',
        [],
        1,
      );
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.changeEmail(user);

      expect(result).toBeTruthy();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });

    it('Should fail change email', async () => {
      const mockQueryResult = createMockQueryResult([], 'UPDATE', [], 0);
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.changeEmail(user);

      expect(result).toBeFalsy();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });
  });

  describe('Change Fullname', () => {
    it('Should success change fullname', async () => {
      const mockQueryResult = createMockQueryResult(
        [userResponse],
        'UPDATE',
        [],
        1,
      );
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.changeFullname(user);

      expect(result).toBeTruthy();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });

    it('Should fail change fullname', async () => {
      const mockQueryResult = createMockQueryResult([], 'UPDATE', [], 0);
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.changeFullname(user);

      expect(result).toBeFalsy();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });
  });

  describe('Change Password', () => {
    it('Should success change password', async () => {
      const mockQueryResult = createMockQueryResult(
        [userResponse],
        'UPDATE',
        [],
        1,
      );
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.changePassword(user);

      expect(result).toBeTruthy();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });

    it('Should fail change password', async () => {
      const mockQueryResult = createMockQueryResult([], 'UPDATE', [], 0);
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.changePassword(user);

      expect(result).toBeFalsy();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });
  });

  describe('Change PhoneNumber', () => {
    it('Should success change phone number', async () => {
      const mockQueryResult = createMockQueryResult(
        [userResponse],
        'UPDATE',
        [],
        1,
      );
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.changePhoneNumber(user);

      expect(result).toBeTruthy();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });

    it('Should fail change phone number', async () => {
      const mockQueryResult = createMockQueryResult([], 'UPDATE', [], 0);
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.changePhoneNumber(user);

      expect(result).toBeFalsy();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });
  });

  describe('Update Provider', () => {
    it('Should success update Provider', async () => {
      const mockQueryResult = createMockQueryResult(
        [userResponse],
        'UPDATE',
        [],
        1,
      );
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.updateProvider(user);

      expect(result).toBeTruthy();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });

    it('Should fail update provider', async () => {
      const mockQueryResult = createMockQueryResult([], 'UPDATE', [], 0);
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.updateProvider(user);

      expect(result).toBeFalsy();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });
  });

  describe('Verify User', () => {
    it('Should success Verify User', async () => {
      const mockQueryResult = createMockQueryResult(
        [userResponse],
        'UPDATE',
        [],
        1,
      );
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.verifyUser(user);

      expect(result).toBeTruthy();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });

    it('Should fail verify user', async () => {
      const mockQueryResult = createMockQueryResult([], 'UPDATE', [], 0);
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.verifyUser(user);

      expect(result).toBeFalsy();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });
  });

  describe('Lock Account', () => {
    it('Should success lock account', async () => {
      const mockQueryResult = createMockQueryResult(
        [userResponse],
        'UPDATE',
        [],
        1,
      );
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.lockAccount(user);

      expect(result).toBeTruthy();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });

    it('Should fail lock account', async () => {
      const mockQueryResult = createMockQueryResult([], 'UPDATE', [], 0);
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.lockAccount(user);

      expect(result).toBeFalsy();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });
  });

  describe('Filter By', () => {
    it('Should return pagination user', async () => {
      const mockQueryResult = createMockQueryResult(
        [userResponse, userResponse, userResponse],
        'SELECT',
        [],
        3,
      );
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgUserRepository.filterBy({
        limit: 10,
        fullname: fullname,
        offset: 0,
      });

      expect(result).toEqual(paginationUserEntity);
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });
  });
});
