import { Test, TestingModule } from '@nestjs/testing';
import { ESProfileRepository } from '@/shared/libs/constant';

import { FindProfileByUserIdHandler } from '../application/queries/find-profile-by-user-id.handler';
import { FindProfileByUserIdQuery } from '../application/queries';
import { ProfileRepository } from '../domain/repositories/profile.repository';
import {
  id,
  mockProfileRepository,
  profile,
  userId,
  profileResponse,
} from './mock';

describe('Find Profile By UserId', () => {
  let findProfileHandler: FindProfileByUserIdHandler;
  let esProfileRepository: ProfileRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindProfileByUserIdHandler,
        { provide: ESProfileRepository, useValue: mockProfileRepository },
      ],
    }).compile();

    findProfileHandler = module.get<FindProfileByUserIdHandler>(
      FindProfileByUserIdHandler,
    );
    esProfileRepository = module.get<ProfileRepository>(ESProfileRepository);

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(findProfileHandler).toBeDefined();
    expect(esProfileRepository).toBeDefined();
  });

  it('Should success find profile', async () => {
    mockProfileRepository.findByUserId.mockResolvedValue([profile]);

    const result = await findProfileHandler.execute(
      new FindProfileByUserIdQuery(id),
    );

    expect(result).toEqual([profileResponse]);
    expect(mockProfileRepository.findByUserId).toHaveBeenCalledWith(userId);
  });

  it('Should seccess find profile zero', async () => {
    mockProfileRepository.findByUserId.mockResolvedValue([]);

    const result = await findProfileHandler.execute(
      new FindProfileByUserIdQuery(id),
    );

    expect(result).toEqual([]);
    expect(mockProfileRepository.findByUserId).toHaveBeenCalledWith(userId);
  });

  it('Should fail find profile invalid uuid format', async () => {
    mockProfileRepository.findByUserId.mockResolvedValue(null);

    await expect(
      findProfileHandler.execute(new FindProfileByUserIdQuery('test')),
    ).rejects.toThrow('Invalid UUID format');

    expect(mockProfileRepository.findByUserId).not.toHaveBeenCalledWith(userId);
  });
});
