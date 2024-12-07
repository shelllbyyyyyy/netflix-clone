import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CloudinaryService } from '@/shared/libs/cloudinary/cloudinary.service';
import {
  ESProfileRepository,
  PGProfileRepository,
  PROFILE_PICTURE,
} from '@/shared/libs/constant';

import { EditProfileCommand } from './edit-profile.command';
import { ProfileResponse } from '../response/profile.response';
import { ProfileRepository } from '../../domain/repositories/profile.repository';
import { ProfileFactory } from '../../domain/factories/profile.factory';

@CommandHandler(EditProfileCommand)
export class EditProfileHandler
  implements ICommandHandler<EditProfileCommand, boolean>
{
  constructor(
    @Inject(PGProfileRepository)
    private readonly profileRepository: ProfileRepository,
    @Inject(ESProfileRepository)
    private readonly esProfileRepository: ProfileRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(command: EditProfileCommand): Promise<boolean> {
    const { profile_picture, profile_name, profile } = command;
    let secure_url: string | undefined;

    if (profile_picture) {
      const { result } = await this.cloudinaryService.deleteImage(
        profile.avatar_url,
      );

      if (result != 'ok') throw new Error('Delete old image failed');

      const upload = await this.cloudinaryService.uploadImageToCloudinary(
        profile_picture,
        PROFILE_PICTURE,
      );

      if (!upload) throw new Error('Upload new image failed');

      secure_url = upload.secure_url;
    }

    const updateProfile: Record<string, any> = {};
    updateProfile['id'] = profile.id;
    updateProfile['updated_at'] = new Date();

    if (secure_url) {
      updateProfile['avatar_url'] = secure_url;
    }

    if (profile_name) {
      updateProfile['profile_name'] = profile_name;
    }

    const [pg, es] = await Promise.all([
      this.profileRepository.update(updateProfile),
      this.esProfileRepository.update(updateProfile),
    ]);

    if (!pg || !es) throw new Error('Edit profile failed');

    return true;
  }
}
