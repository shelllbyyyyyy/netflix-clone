import { Test, TestingModule } from '@nestjs/testing';

import { DatabaseService } from '@/shared/libs/pg/database.service';
import { createMockQueryResult } from '@/shared/mocks/mock-query-result';

import { PGProfileRepositoryImpl } from '../infrastructure/repositories/pg.profile.repository.impl';
import {
  mockDatabaseService,
  profile,
  profile_id,
  profile_name,
  profileId,
  profileResponse,
  secured_url,
  userId,
} from './mock';

describe('PG Profile Repository', () => {
  let pgProfileRepository: PGProfileRepositoryImpl;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PGProfileRepositoryImpl,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    pgProfileRepository = module.get<PGProfileRepositoryImpl>(
      PGProfileRepositoryImpl,
    );
    databaseService = module.get<DatabaseService>(DatabaseService);

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(pgProfileRepository).toBeDefined();
    expect(databaseService).toBeDefined();
  });

  describe('Save Profile', () => {
    it('Should success save profile', async () => {
      const mockQueryResult = createMockQueryResult(
        [profileResponse],
        'INSERT',
        [],
        1,
      );
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgProfileRepository.save(profile);

      expect(result).toEqual(profile);
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });

    it('Should fail save profile', async () => {
      const mockQueryResult = createMockQueryResult([], 'INSERT', [], 0);
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgProfileRepository.save(profile);

      expect(result).toBeNull();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });
  });

  describe('Find profile by id', () => {
    it('Should success find profile by id', async () => {
      const mockQueryResult = createMockQueryResult(
        [profileResponse],
        'SELECT',
        [],
        1,
      );
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgProfileRepository.findById(profileId);

      expect(result).toEqual(profile);
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });

    it('Should fail find profile by id', async () => {
      const mockQueryResult = createMockQueryResult([], 'SELECT', [], 0);
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgProfileRepository.findById(profileId);

      expect(result).toBeNull();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });
  });

  describe('Find profile by user id', () => {
    it('Should success find profile by user id', async () => {
      const mockQueryResult = createMockQueryResult(
        [profileResponse],
        'SELECT',
        [],
        1,
      );
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgProfileRepository.findByUserId(userId);

      expect(result).toEqual([profile]);
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });

    it('Should fail find profile by user id', async () => {
      const mockQueryResult = createMockQueryResult([], 'SELECT', [], 0);
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgProfileRepository.findByUserId(userId);

      expect(result).toEqual([]);
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });
  });

  describe('Delete profile', () => {
    it('Should success delete profile', async () => {
      const mockQueryResult = createMockQueryResult([], 'DELETE', [], 1);
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgProfileRepository.delete(profile);

      expect(result).toBeTruthy();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });

    it('Should fail delete profile', async () => {
      const mockQueryResult = createMockQueryResult([], 'DELETE', [], 0);
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgProfileRepository.delete(profile);

      expect(result).toBeFalsy();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });
  });

  describe('Update profile', () => {
    const updateProfile: Record<string, any> = {};
    updateProfile['id'] = profile_id;
    updateProfile['updated_at'] = new Date();
    updateProfile['avatar_url'] = secured_url;
    updateProfile['profile_name'] = profile_name;

    it('Should success update profile', async () => {
      const mockQueryResult = createMockQueryResult(
        [profileResponse],
        'UPDATE',
        [],
        1,
      );
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgProfileRepository.update(updateProfile);

      expect(result).toBeTruthy();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });

    it('Should fail update profile', async () => {
      const mockQueryResult = createMockQueryResult([], 'UPDATE', [], 0);
      mockDatabaseService.query.mockResolvedValue(mockQueryResult);

      const result = await pgProfileRepository.update(profile);

      expect(result).toBeFalsy();
      expect(mockDatabaseService.query).toHaveBeenCalled();
    });
  });
});
