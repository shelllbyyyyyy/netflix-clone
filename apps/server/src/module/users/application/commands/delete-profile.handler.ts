import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  ESProfileRepository,
  PGProfileRepository,
} from '@/shared/libs/constant';
import { CloudinaryService } from '@/shared/libs/cloudinary/cloudinary.service';

import { DeleteProfileCommand } from './delete-profile.command';
import { ProfileRepository } from '../../domain/repositories/profile.repository';
import { ProfileFactory } from '../../domain/factories/profile.factory';

@CommandHandler(DeleteProfileCommand)
export class DeleteProfileHandler
  implements ICommandHandler<DeleteProfileCommand, boolean>
{
  constructor(
    @Inject(PGProfileRepository)
    private readonly profileRepository: ProfileRepository,
    @Inject(ESProfileRepository)
    private readonly esProfileRepository: ProfileRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(command: DeleteProfileCommand): Promise<boolean> {
    const { profile } = command;

    if (!profile) throw new Error('Value cannot be undefined');

    const onDeleteProfile = ProfileFactory.toDomain(profile);

    const [pg, es] = await Promise.all([
      this.profileRepository.delete(onDeleteProfile),
      this.esProfileRepository.delete(onDeleteProfile),
    ]);

    if (!pg || !es) {
      return false;
    }

    const { result } = await this.cloudinaryService.deleteImage(
      profile.avatar_url,
    );

    if (result !== 'ok') {
      return false;
    }

    return true;
  }
}
