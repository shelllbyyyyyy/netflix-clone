import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class FilterUserDTO {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'ea79-49heorth-32hiedf' })
  readonly userId?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'ea79-49heorth-32hiedf' })
  readonly profile_id?: string;

  @IsString()
  @Min(3)
  @Max(50)
  @IsOptional()
  @ApiPropertyOptional({ example: 'John Doe' })
  readonly fullname?: string;

  @IsString()
  @Min(3)
  @Max(50)
  @IsOptional()
  @ApiPropertyOptional({ example: '12839470' })
  readonly phone_number?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  @ApiPropertyOptional({ example: 'johndoe@email.com' })
  readonly email?: string;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({ example: true })
  readonly is_verified?: boolean;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'google' })
  readonly provider?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'id-asc' })
  readonly order_by?: string;

  @IsNumber()
  @IsOptional()
  @Transform((value) => Number(value))
  @ApiPropertyOptional({ example: 10 })
  readonly limit?: number;

  @IsDate()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '2024-12-01' })
  readonly created_at?: Date;

  @IsDate()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '2024-12-01' })
  readonly created_at_start?: Date;

  @IsDate()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: '2024-12-31' })
  readonly created_at_end?: Date;

  @IsNumber()
  @Transform((value) => Number(value))
  @IsOptional()
  @ApiPropertyOptional({ example: 1 })
  readonly page?: number;
}
