import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  @Min(8)
  @Max(255)
  @IsOptional()
  @ApiPropertyOptional({ example: 'oldpassword' })
  readonly current_password?: string;

  @IsString()
  @Min(3)
  @Max(50)
  @IsOptional()
  @ApiPropertyOptional({ example: 'New John Doe' })
  readonly fullname?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional({ example: 'johdoe@email.com' })
  readonly email?: string;

  @IsString()
  @Min(8)
  @Max(255)
  @IsOptional()
  @ApiPropertyOptional({ example: 'newpassword' })
  readonly password?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: true })
  readonly is_verified?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: true })
  readonly is_account_non_locked?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: true })
  readonly is_account_non_expired?: boolean;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'google' })
  readonly provider?: string;
}
