import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { User } from '@/common/decorator/user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ApiResponse } from '@/common/response/api';

import {
  CreateProfileCommand,
  DeleteProfileCommand,
  EditProfileCommand,
} from './application/commands';
import { CreateProfileDTO } from './application/dto/create-profile.dto';
import {
  FindProfileByIdQuery,
  FindProfileByUserIdQuery,
  FindUserByIdQuery,
} from './application/queries';
import { ProfileResponse } from './application/response/profile.response';
import { UserResponse } from './application/response/user.reponse';
import { EditProfileDTO } from './application/dto/edit-profile.dto';

@ApiTags('Profile')
@Controller('users/profiles')
export class ProfileController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBody({
    type: CreateProfileDTO,
  })
  @ApiCreatedResponse({
    description: 'Profile added successfully',
  })
  @ApiBadRequestResponse({
    description: 'Something wrong',
  })
  @UseInterceptors(FileInterceptor('profile-picture'))
  async createProfile(
    @User() user: any,
    @Body() data: CreateProfileDTO,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
        fileIsRequired: false,
      }),
    )
    profilePictureFile: Express.Multer.File,
  ) {
    const { profile_name } = data;

    try {
      const command = new CreateProfileCommand(
        user.sub,
        profile_name,
        profilePictureFile,
      );

      const result = await this.commandBus.execute<
        CreateProfileCommand,
        ProfileResponse
      >(command);

      if (!result) throw new BadRequestException('Something wrong');

      return new ApiResponse(
        HttpStatus.CREATED,
        'Profile added successfully',
        result,
      );
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  @ApiBody({
    type: EditProfileDTO,
  })
  @ApiOkResponse({
    description: 'Profile update successfully',
  })
  @ApiBadRequestResponse({
    description: 'Something wrong',
  })
  @UseInterceptors(FileInterceptor('profile-picture'))
  async editProfile(
    @User() user: any,
    @Body() data: EditProfileDTO,
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
        fileIsRequired: false,
      }),
    )
    profilePictureFile?: Express.Multer.File,
  ) {
    const { profile_name } = data;

    try {
      const queryProfile = new FindProfileByIdQuery(id);

      const profile = await this.queryBus.execute<
        FindProfileByIdQuery,
        ProfileResponse
      >(queryProfile);

      const command = new EditProfileCommand(
        profile,
        profile_name,
        profilePictureFile,
      );

      const result = await this.commandBus.execute<
        EditProfileCommand,
        ProfileResponse
      >(command);

      if (!result) throw new BadRequestException('Something wrong');

      return new ApiResponse(
        HttpStatus.OK,
        'Profile update successfully',
        result,
      );
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id/delete-profile')
  @ApiOkResponse({
    description: 'Profile delete successfully',
  })
  @ApiBadRequestResponse({
    description: 'Something wrong',
  })
  async deleteProfile(@Param('id') id: string) {
    try {
      const queryProfile = new FindProfileByIdQuery(id);

      const profile = await this.queryBus.execute<
        FindProfileByIdQuery,
        ProfileResponse
      >(queryProfile);

      const command = new DeleteProfileCommand(profile);

      const result = await this.commandBus.execute<
        DeleteProfileCommand,
        boolean
      >(command);

      if (!result) throw new BadRequestException('Something wrong');

      return new ApiResponse(
        HttpStatus.OK,
        'Profile deleted successfully',
        result,
      );
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({
    description: 'User found',
  })
  @ApiBadRequestResponse({
    description: 'Something wrong',
  })
  async findProfiles(@User() user: any) {
    try {
      const query = new FindProfileByUserIdQuery(user.sub);
      const findProfile = await this.queryBus.execute<
        FindProfileByUserIdQuery,
        ProfileResponse[]
      >(query);

      return new ApiResponse(HttpStatus.OK, 'Profile found', findProfile);
    } catch (error) {
      throw error;
    }
  }
}
