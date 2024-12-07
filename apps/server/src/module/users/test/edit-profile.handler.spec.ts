import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from '@/shared/libs/cloudinary/cloudinary.service';

import { EditProfileCommand } from '../application/commands';
import { EditProfileHandler } from '../application/commands/edit-profile.handler';
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
  profileResponse,
  secured_url,
} from './mock';

describe('Edit Profile Handler', () => {
  let editProfileHandler: EditProfileHandler;
  let pgProfileRepository: ProfileRepository;
  let esProfileRepository: ProfileRepository;
  let cloudinaryService: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EditProfileHandler,
        { provide: PGProfileRepository, useValue: mockProfileRepository },
        { provide: ESProfileRepository, useValue: mockProfileRepository },
        { provide: CloudinaryService, useValue: mockCloudinaryService },
      ],
    }).compile();

    editProfileHandler = module.get<EditProfileHandler>(EditProfileHandler);
    pgProfileRepository = module.get<ProfileRepository>(PGProfileRepository);
    esProfileRepository = module.get<ProfileRepository>(ESProfileRepository);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(EditProfileHandler).toBeDefined();
    expect(pgProfileRepository).toBeDefined();
    expect(esProfileRepository).toBeDefined();
    expect(cloudinaryService).toBeDefined();
  });

  it('Should success Edit profile with just profile name', async () => {
    mockCloudinaryService.deleteImage.mockResolvedValue(null);
    mockCloudinaryService.uploadImageToCloudinary.mockResolvedValue(null);
    mockProfileRepository.update.mockResolvedValueOnce(true);
    mockProfileRepository.update.mockResolvedValueOnce(true);

    const result = await editProfileHandler.execute(
      new EditProfileCommand(profileResponse, 'test new'),
    );

    expect(result).toBeTruthy();
    expect(mockCloudinaryService.deleteImage).not.toHaveBeenCalledWith(
      secured_url,
    );
    expect(
      mockCloudinaryService.uploadImageToCloudinary,
    ).not.toHaveBeenCalledWith(secured_url);
    expect(mockProfileRepository.update).toHaveBeenCalledTimes(2);
  });

  it('Should success Edit profile with just image', async () => {
    mockCloudinaryService.deleteImage.mockResolvedValue({ result: 'ok' });
    mockCloudinaryService.uploadImageToCloudinary.mockResolvedValue(
      mockClodinaryResponse,
    );
    mockProfileRepository.update.mockResolvedValueOnce(true);
    mockProfileRepository.update.mockResolvedValueOnce(true);

    const result = await editProfileHandler.execute(
      new EditProfileCommand(profileResponse, undefined, avatar_url),
    );

    expect(result).toBeTruthy();
    expect(mockCloudinaryService.deleteImage).toHaveBeenCalledWith(secured_url);
    expect(mockCloudinaryService.uploadImageToCloudinary).toHaveBeenCalledWith(
      avatar_url,
      PROFILE_PICTURE,
    );
    expect(mockProfileRepository.update).toHaveBeenCalledTimes(2);
  });

  it('Should fail Edit profile cause deleting old image fail', async () => {
    mockCloudinaryService.deleteImage.mockResolvedValue({ result: 'failed' });
    mockCloudinaryService.uploadImageToCloudinary.mockResolvedValue(null);
    mockProfileRepository.update.mockResolvedValueOnce(null);
    mockProfileRepository.update.mockResolvedValueOnce(null);

    await expect(
      editProfileHandler.execute(
        new EditProfileCommand(profileResponse, undefined, avatar_url),
      ),
    ).rejects.toThrow('Delete old image failed');

    expect(mockCloudinaryService.deleteImage).toHaveBeenCalledWith(secured_url);
    expect(
      mockCloudinaryService.uploadImageToCloudinary,
    ).not.toHaveBeenCalledWith(avatar_url, PROFILE_PICTURE);
    expect(mockProfileRepository.update).not.toHaveBeenCalledTimes(2);
  });

  it('Should fail Edit profile cause uploading new image fail', async () => {
    mockCloudinaryService.deleteImage.mockResolvedValue({ result: 'ok' });
    mockCloudinaryService.uploadImageToCloudinary.mockResolvedValue(null);
    mockProfileRepository.update.mockResolvedValueOnce(null);
    mockProfileRepository.update.mockResolvedValueOnce(null);

    await expect(
      editProfileHandler.execute(
        new EditProfileCommand(profileResponse, undefined, avatar_url),
      ),
    ).rejects.toThrow('Upload new image failed');

    expect(mockCloudinaryService.deleteImage).toHaveBeenCalledWith(secured_url);
    expect(mockCloudinaryService.uploadImageToCloudinary).toHaveBeenCalledWith(
      avatar_url,
      PROFILE_PICTURE,
    );
    expect(mockProfileRepository.update).not.toHaveBeenCalledTimes(2);
  });

  it('Should fail Edit profile cause persisting to database fail', async () => {
    mockCloudinaryService.deleteImage.mockResolvedValue({ result: 'ok' });
    mockCloudinaryService.uploadImageToCloudinary.mockResolvedValue(
      mockClodinaryResponse,
    );
    mockProfileRepository.update.mockResolvedValueOnce(null);
    mockProfileRepository.update.mockResolvedValueOnce(null);

    await expect(
      editProfileHandler.execute(
        new EditProfileCommand(profileResponse, undefined, avatar_url),
      ),
    ).rejects.toThrow('Edit profile failed');

    expect(mockCloudinaryService.deleteImage).toHaveBeenCalledWith(secured_url);
    expect(mockCloudinaryService.uploadImageToCloudinary).toHaveBeenCalledWith(
      avatar_url,
      PROFILE_PICTURE,
    );
    expect(mockProfileRepository.update).toHaveBeenCalledTimes(2);
  });
});
