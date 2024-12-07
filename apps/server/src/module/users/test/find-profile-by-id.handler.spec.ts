import { Test, TestingModule } from '@nestjs/testing';
import { ESProfileRepository } from '@/shared/libs/constant';

import { FindProfileByIdHandler } from '../application/queries/find-profile-by-id.handler';
import { FindProfileByIdQuery } from '../application/queries';
import { ProfileRepository } from '../domain/repositories/profile.repository';
import {
  mockProfileRepository,
  profile,
  profile_id,
  profileId,
  profileResponse,
} from './mock';

describe('Find Profile By Id', () => {
  let findProfileHandler: FindProfileByIdHandler;
  let esProfileRepository: ProfileRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindProfileByIdHandler,
        { provide: ESProfileRepository, useValue: mockProfileRepository },
      ],
    }).compile();

    findProfileHandler = module.get<FindProfileByIdHandler>(
      FindProfileByIdHandler,
    );
    esProfileRepository = module.get<ProfileRepository>(ESProfileRepository);

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(findProfileHandler).toBeDefined();
    expect(esProfileRepository).toBeDefined();
  });

  it('Should success find profile', async () => {
    mockProfileRepository.findById.mockResolvedValue(profile);

    const result = await findProfileHandler.execute(
      new FindProfileByIdQuery(profile_id),
    );

    expect(result).toEqual(profileResponse);
    expect(mockProfileRepository.findById).toHaveBeenCalledWith(profileId);
  });

  it('Should fail find profile', async () => {
    mockProfileRepository.findById.mockResolvedValue(null);

    const result = await findProfileHandler.execute(
      new FindProfileByIdQuery(profile_id),
    );

    expect(result).toBeNull();
    expect(mockProfileRepository.findById).toHaveBeenCalledWith(profileId);
  });

  it('Should fail find profile invalid uuid format', async () => {
    mockProfileRepository.findById.mockResolvedValue(null);

    await expect(
      findProfileHandler.execute(new FindProfileByIdQuery('test')),
    ).rejects.toThrow('Invalid UUID format');

    expect(mockProfileRepository.findById).not.toHaveBeenCalledWith(profileId);
  });
});
