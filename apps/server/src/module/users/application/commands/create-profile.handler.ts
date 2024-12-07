import { randomUUID } from 'crypto';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CloudinaryService } from '@/shared/libs/cloudinary/cloudinary.service';
import {
  ESProfileRepository,
  PGProfileRepository,
  PROFILE_PICTURE,
} from '@/shared/libs/constant';

import { CreateProfileCommand } from './create-profile.command';
import { ProfileResponse } from '../response/profile.response';
import { ProfileRepository } from '../../domain/repositories/profile.repository';
import { ProfileEntity } from '../../domain/entities/profile.entity';
import { UserId } from '../../domain/value-object/userId';
import { ProfileFactory } from '../../domain/factories/profile.factory';
import { ProfileId } from '../../domain/value-object/profileId';

@CommandHandler(CreateProfileCommand)
export class CreateProfileHandler
  implements ICommandHandler<CreateProfileCommand, ProfileResponse>
{
  constructor(
    @Inject(PGProfileRepository)
    private readonly profileRepository: ProfileRepository,
    @Inject(ESProfileRepository)
    private readonly esProfileRepository: ProfileRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(command: CreateProfileCommand): Promise<ProfileResponse> {
    const { profile_picture, profile_name, user_id } = command;
    const created_at = new Date();

    if (!profile_picture || !profile_name || !user_id) {
      throw new Error('Value cannot be undefined');
    }

    const upload = await this.cloudinaryService.uploadImageToCloudinary(
      profile_picture,
      PROFILE_PICTURE,
    );

    if (!upload) throw new Error('Upload image failed');

    const id = randomUUID();

    const userId = new UserId(user_id);
    const profileId = new ProfileId(id);

    const profile = new ProfileEntity();
    profile.setId(profileId);
    profile.setUserId(userId);
    profile.setProfileName(profile_name);
    profile.setAvatarUrl(upload.secure_url);
    profile.setCreatedAt(created_at);
    profile.setUpdatedAt(created_at);

    const [pg, es] = await Promise.all([
      this.profileRepository.save(profile),
      this.esProfileRepository.save(profile),
    ]);

    if (!pg || !es) return null;

    return ProfileFactory.toResponse(profile);
  }
}
