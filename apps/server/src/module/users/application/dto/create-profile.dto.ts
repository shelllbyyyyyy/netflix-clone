import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateProfileDTO {
  @IsString()
  @ApiProperty({ example: 'John Doe family' })
  readonly profile_name: string;
}
