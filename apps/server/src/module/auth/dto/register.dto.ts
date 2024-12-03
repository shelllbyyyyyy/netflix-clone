import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Max, Min } from 'class-validator';

export class RegisterDTO {
  @IsString()
  @Min(3)
  @Max(50)
  @ApiProperty({ example: '0214796543756' })
  readonly phone_number: string;

  @IsString()
  @Min(3)
  @Max(50)
  @ApiProperty({ example: 'John Doe' })
  readonly fullname: string;

  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'johndoe@getMaxListeners.com' })
  readonly email: string;

  @IsString()
  @Min(8)
  @Max(255)
  @ApiProperty({ example: 'test9214993' })
  readonly password: string;
}
