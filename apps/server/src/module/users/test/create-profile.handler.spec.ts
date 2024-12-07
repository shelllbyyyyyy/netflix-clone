import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from '@/shared/libs/cloudinary/cloudinary.service';

import { CreateProfileHandler } from '../application/commands/create-profile.handler';
import { ProfileRepository } from '../domain/repositories/profile.repository';
import {
  ESProfileRepository,
  PGProfileRepository,
  PROFILE_PICTURE,
} from '@/shared/libs/constant';
import {
  avatar_url,
  mockClodinaryResponse,
  mockCloudinaryService,
  mockProfileRepository,
  profile,
  profileCommand,
} from './mock';
import { CreateProfileCommand } from '../application/commands';

describe('Create Profile Handler', () => {
  let createProfileHandler: CreateProfileHandler;
  let pgProfileRepository: ProfileRepository;
  let esProfileRepository: ProfileRepository;
  let cloudinaryService: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProfileHandler,
        { provide: PGProfileRepository, useValue: mockProfileRepository },
        { provide: ESProfileRepository, useValue: mockProfileRepository },
        { provide: CloudinaryService, useValue: mockCloudinaryService },
      ],
    }).compile();

    createProfileHandler =
      module.get<CreateProfileHandler>(CreateProfileHandler);
    pgProfileRepository = module.get<ProfileRepository>(PGProfileRepository);
    esProfileRepository = module.get<ProfileRepository>(ESProfileRepository);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(createProfileHandler).toBeDefined();
    expect(pgProfileRepository).toBeDefined();
    expect(esProfileRepository).toBeDefined();
    expect(cloudinaryService).toBeDefined();
  });

  it('Should success create new profile', async () => {
    mockCloudinaryService.uploadImageToCloudinary.mockResolvedValue(
      mockClodinaryResponse,
    );
    mockProfileRepository.save.mockResolvedValueOnce(profile);
    mockProfileRepository.save.mockResolvedValueOnce(profile);

    const result = await createProfileHandler.execute(profileCommand);

    expect(result).not.toBeNull();
    expect(mockCloudinaryService.uploadImageToCloudinary).toHaveBeenCalledWith(
      avatar_url,
      PROFILE_PICTURE,
    );
    expect(mockProfileRepository.save).toHaveBeenCalledTimes(2);
  });

  it('Should fail create new profile with undefined values', async () => {
    const copy = new CreateProfileCommand(null, null, null);

    mockCloudinaryService.uploadImageToCloudinary.mockResolvedValue(null);
    mockProfileRepository.save.mockResolvedValueOnce(null);
    mockProfileRepository.save.mockResolvedValueOnce(null);

    await expect(createProfileHandler.execute(copy)).rejects.toThrow(
      'Value cannot be undefined',
    );
    expect(
      mockCloudinaryService.uploadImageToCloudinary,
    ).not.toHaveBeenCalledWith(avatar_url, PROFILE_PICTURE);
    expect(mockProfileRepository.save).not.toHaveBeenCalledTimes(2);
  });

  it('Should fail create new profile with upload image error', async () => {
    mockCloudinaryService.uploadImageToCloudinary.mockResolvedValue(null);
    mockProfileRepository.save.mockResolvedValueOnce(null);
    mockProfileRepository.save.mockResolvedValueOnce(null);

    await expect(createProfileHandler.execute(profileCommand)).rejects.toThrow(
      'Upload image failed',
    );
    expect(mockCloudinaryService.uploadImageToCloudinary).toHaveBeenCalledWith(
      avatar_url,
      PROFILE_PICTURE,
    );
    expect(mockProfileRepository.save).not.toHaveBeenCalledTimes(2);
  });

  it('Should fail create new profile with persist to database error', async () => {
    mockCloudinaryService.uploadImageToCloudinary.mockResolvedValue(
      mockClodinaryResponse,
    );
    mockProfileRepository.save.mockResolvedValueOnce(null);
    mockProfileRepository.save.mockResolvedValueOnce(null);

    const result = await createProfileHandler.execute(profileCommand);

    expect(result).toBeNull();
    expect(mockCloudinaryService.uploadImageToCloudinary).toHaveBeenCalledWith(
      avatar_url,
      PROFILE_PICTURE,
    );
    expect(mockProfileRepository.save).toHaveBeenCalledTimes(2);
  });
});
