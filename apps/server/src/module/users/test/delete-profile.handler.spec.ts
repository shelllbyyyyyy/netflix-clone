import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from '@/shared/libs/cloudinary/cloudinary.service';

import { DeleteProfileHandler } from '../application/commands/delete-profile.handler';
import { ProfileRepository } from '../domain/repositories/profile.repository';
import {
  ESProfileRepository,
  PGProfileRepository,
} from '@/shared/libs/constant';
import {
  mockCloudinaryService,
  mockProfileRepository,
  profileResponse,
  secured_url,
} from './mock';
import { DeleteProfileCommand } from '../application/commands';

describe('Delete Profile Handler', () => {
  let deleteProfileHandler: DeleteProfileHandler;
  let pgProfileRepository: ProfileRepository;
  let esProfileRepository: ProfileRepository;
  let cloudinaryService: CloudinaryService;

  const command = new DeleteProfileCommand(profileResponse);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteProfileHandler,
        { provide: PGProfileRepository, useValue: mockProfileRepository },
        { provide: ESProfileRepository, useValue: mockProfileRepository },
        { provide: CloudinaryService, useValue: mockCloudinaryService },
      ],
    }).compile();

    deleteProfileHandler =
      module.get<DeleteProfileHandler>(DeleteProfileHandler);
    pgProfileRepository = module.get<ProfileRepository>(PGProfileRepository);
    esProfileRepository = module.get<ProfileRepository>(ESProfileRepository);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);

    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(DeleteProfileHandler).toBeDefined();
    expect(pgProfileRepository).toBeDefined();
    expect(esProfileRepository).toBeDefined();
    expect(cloudinaryService).toBeDefined();
  });

  it('Should success delete profile', async () => {
    mockProfileRepository.delete.mockResolvedValueOnce(true);
    mockProfileRepository.delete.mockResolvedValueOnce(true);
    mockCloudinaryService.deleteImage.mockResolvedValue({ result: 'ok' });

    const result = await deleteProfileHandler.execute(command);

    expect(result).toBeTruthy();
    expect(mockCloudinaryService.deleteImage).toHaveBeenCalledWith(secured_url);
    expect(mockProfileRepository.delete).toHaveBeenCalledTimes(2);
  });

  it('Should fail delete profile cause null value', async () => {
    mockProfileRepository.delete.mockResolvedValueOnce(true);
    mockProfileRepository.delete.mockResolvedValueOnce(true);
    mockCloudinaryService.deleteImage.mockResolvedValue({ result: 'ok' });

    await expect(
      deleteProfileHandler.execute(new DeleteProfileCommand(null)),
    ).rejects.toThrow('Value cannot be undefined');

    expect(mockCloudinaryService.deleteImage).not.toHaveBeenCalledWith(
      secured_url,
    );
    expect(mockProfileRepository.delete).not.toHaveBeenCalledTimes(2);
  });

  it('Should fail delete profile cause delete from database error', async () => {
    mockProfileRepository.delete.mockResolvedValueOnce(false);
    mockProfileRepository.delete.mockResolvedValueOnce(false);

    const result = await deleteProfileHandler.execute(command);

    expect(result).toBeTruthy();
    expect(mockProfileRepository.delete).toHaveBeenCalledTimes(2);
    expect(mockCloudinaryService.deleteImage).toHaveBeenCalledWith(secured_url);
  });

  it('Should fail delete profile cause delete image from cloud error', async () => {
    mockCloudinaryService.deleteImage.mockResolvedValue({ result: 'fail' });
    mockProfileRepository.delete.mockResolvedValueOnce(false);
    mockProfileRepository.delete.mockResolvedValueOnce(false);

    const result = await deleteProfileHandler.execute(command);

    expect(result).toBeFalsy();
    expect(mockProfileRepository.delete).toHaveBeenCalledTimes(2);
    expect(mockCloudinaryService.deleteImage).not.toHaveBeenCalledWith(
      secured_url,
    );
  });
});
