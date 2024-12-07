import { CreateProfileDTO } from './create-profile.dto';
import { PartialType } from '@nestjs/mapped-types';

export class EditProfileDTO extends PartialType(CreateProfileDTO) {}
