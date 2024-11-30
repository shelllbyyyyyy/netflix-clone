import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Max, Min } from 'class-validator';

export class LoginDTO {
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'johndoe@getMaxListeners.com' })
  readonly email: string;

  @IsString()
  @Min(8)
  @Max(255)
  @ApiProperty({ example: 'password12345' })
  readonly password: string;
}
