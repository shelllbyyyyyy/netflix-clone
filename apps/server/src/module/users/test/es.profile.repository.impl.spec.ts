import { Test, TestingModule } from '@nestjs/testing';

import { SearchService } from '@/shared/libs/elastic/search.service';
import {
  createMockByWriteResponse,
  createMockElasticResponse,
} from '@/shared/mocks/mock-elastic-result';

import { ProfileResponse } from '../application/response/profile.response';
import { ESProfileRepositoryImpl } from '../infrastructure/repositories/es.profile.repository,impl';

import {
  profile_id,
  mockElasticService,
  profileResponse,
  query,
  profile,
  profileId,
  id,
  userId,
  secured_url,
  profile_name,
} from './mock';

describe('ES profile Repository', () => {
  let esProfileRepository: ESProfileRepositoryImpl;
  let searchService: SearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ESProfileRepositoryImpl,
        { provide: SearchService, useValue: mockElasticService },
      ],
    }).compile();

    searchService = module.get<SearchService>(SearchService);
    esProfileRepository = module.get<ESProfileRepositoryImpl>(
      ESProfileRepositoryImpl,
    );

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(esProfileRepository).toBeDefined();
    expect(searchService).toBeDefined();
  });

  describe('Save profile', () => {
    it('Should success save profile', async () => {
      const mockElasticResult = createMockElasticResponse<ProfileResponse>(
        [profileResponse],
        1,
        1,
        'created',
      );

      mockElasticService.index.mockResolvedValue(mockElasticResult);

      const result = await esProfileRepository.save(profile);

      expect(result).toEqual(profile);
      expect(mockElasticService.index).toHaveBeenCalledWith(
        'profiles',
        profile_id,
        profileResponse,
      );
    });

    it('Should fail save profile', async () => {
      const mockElasticResult = createMockElasticResponse<ProfileResponse>(
        [],
        0,
        0,
        'failure',
      );

      mockElasticService.index.mockResolvedValue(mockElasticResult);

      const result = await esProfileRepository.save(profile);

      expect(result).toEqual(null);
      expect(mockElasticService.index).toHaveBeenCalledWith(
        'profiles',
        profile_id,
        profileResponse,
      );
    });
  });

  describe('Find Profile by id', () => {
    it('Should success find Profile by id', async () => {
      const mockElasticResult = createMockElasticResponse<ProfileResponse>(
        [profileResponse],
        1,
        1,
      );
      const queries = query;
      queries['term'] = {
        _id: profile_id,
      };

      mockElasticService.searchExact.mockResolvedValue(mockElasticResult);

      const result = await esProfileRepository.findById(profileId);

      expect(result).toEqual(profile);
      expect(mockElasticService.searchExact).toHaveBeenCalledWith(
        'profiles',
        queries,
      );
    });

    it('Should fail find Profile by id', async () => {
      const mockElasticResult = createMockElasticResponse<ProfileResponse>(
        [],
        0,
        0,
      );
      const queries = query;
      queries['term'] = {
        _id: profile_id,
      };

      mockElasticService.searchExact.mockResolvedValue(mockElasticResult);

      const result = await esProfileRepository.findById(profileId);

      expect(result).toBeNull();
      expect(mockElasticService.searchExact).toHaveBeenCalledWith(
        'profiles',
        queries,
      );
    });
  });

  describe('Find Profile by UserId', () => {
    it('Should success find Profile by user id', async () => {
      const mockElasticResult = createMockElasticResponse<ProfileResponse>(
        [profileResponse],
        1,
        1,
      );
      const queries: Record<string, any> = {};
      queries['match'] = {
        user_id: id,
      };

      mockElasticService.searchExact.mockResolvedValue(mockElasticResult);

      const result = await esProfileRepository.findByUserId(userId);

      expect(result).toEqual([profile]);
      expect(mockElasticService.searchExact).toHaveBeenCalledWith(
        'profiles',
        queries,
      );
    });

    it('Should fail find Profile by id', async () => {
      const mockElasticResult = createMockElasticResponse<ProfileResponse>(
        [],
        0,
        0,
      );
      const queries: Record<string, any> = {};
      queries['match'] = {
        user_id: id,
      };

      mockElasticService.searchExact.mockResolvedValue(mockElasticResult);

      const result = await esProfileRepository.findByUserId(userId);

      expect(result).toEqual([]);
      expect(mockElasticService.searchExact).toHaveBeenCalledWith(
        'profiles',
        queries,
      );
    });
  });

  describe('Delete profile', () => {
    it('Should success delete profile', async () => {
      const mockResponse = createMockByWriteResponse(
        profile_id,
        'profiles',
        'deleted',
        1,
        1,
        0,
      );

      mockElasticService.delete.mockResolvedValue(mockResponse);

      const result = await esProfileRepository.delete(profile);

      expect(result).toBeTruthy();
      expect(mockElasticService.delete).toHaveBeenCalledWith(
        'profiles',
        profile_id,
      );
    });

    it('Should fail delete profile', async () => {
      const mockResponse = createMockByWriteResponse(
        id,
        'profiles',
        'not_found',
        0,
        0,
        0,
      );

      mockElasticService.delete.mockResolvedValue(mockResponse);

      const result = await esProfileRepository.delete(profile);

      expect(result).toBeFalsy();
      expect(mockElasticService.delete).toHaveBeenCalledWith(
        'profiles',
        profile_id,
      );
    });
  });

  describe('Update profile', () => {
    const updateProfile: Record<string, any> = {};
    updateProfile['id'] = profile_id;
    updateProfile['updated_at'] = new Date();
    updateProfile['avatar_url'] = secured_url;
    updateProfile['profile_name'] = profile_name;

    it('Should success update profile', async () => {
      const mockResponse = createMockByWriteResponse(
        profile_id,
        'profiles',
        'updated',
        1,
        1,
        0,
      );

      mockElasticService.update.mockResolvedValue(mockResponse);

      const result = await esProfileRepository.update(updateProfile);

      expect(result).toBeTruthy();
      expect(mockElasticService.update).toHaveBeenCalledWith(
        'profiles',
        profile_id,
        {
          avatar_url: updateProfile.avatar_url,
          profile_name: updateProfile.profile_name,
          updated_at: updateProfile.updated_at,
        },
      );
    });

    it('Should fail update profile', async () => {
      const mockResponse = createMockByWriteResponse(
        profile_id,
        'profiles',
        'not_found',
        0,
        0,
        0,
      );

      mockElasticService.update.mockResolvedValue(mockResponse);

      const result = await esProfileRepository.update(updateProfile);

      expect(result).toBeFalsy();
      expect(mockElasticService.update).toHaveBeenCalledWith(
        'profiles',
        profile_id,
        {
          avatar_url: updateProfile.avatar_url,
          profile_name: updateProfile.profile_name,
          updated_at: updateProfile.updated_at,
        },
      );
    });
  });
});
