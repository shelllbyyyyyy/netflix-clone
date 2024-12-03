import { Request, Response } from 'express';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { ApiResponse } from '@/common/response/api';
import { DynamicOAuthGuard } from '@/common/guards/dynamic-oauth.guard';
import { LocalAuthGuard } from '@/common/guards/local-auth.guard';

import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { GenerateJwtToken } from './service/generate-jwt-token';
import { ValidateUserCredentials } from './service/validate-user-credentials';
import { UserResponse } from '../users/application/response/user.reponse';
import { FindUserByEmailQuery } from '../users/application/queries';
import { CreateUserCommand } from '../users/application/commands/create-user.command';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GenerateRefreshToken } from './service/generate-refresh-token';
import { RefreshAuthGuard } from '@/common/guards/refresh-token-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly validateUserCredentials: ValidateUserCredentials,
    private readonly generateJwtToken: GenerateJwtToken,
    private readonly generateRefreshToken: GenerateRefreshToken,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('register')
  @ApiBody({ type: RegisterDTO })
  @ApiCreatedResponse({
    description: 'Register successfully',
  })
  @ApiBadRequestResponse({
    description: 'User already exist',
  })
  async register(@Body() data: RegisterDTO) {
    try {
      const query = new FindUserByEmailQuery(data.email);

      const user = await this.queryBus.execute<
        FindUserByEmailQuery,
        UserResponse | null
      >(query);
      if (user) throw new BadRequestException('User already exist');

      const command = new CreateUserCommand(
        data.fullname,
        data.phone_number,
        data.email,
        data.password,
        'local',
      );
      const result = await this.commandBus.execute<
        CreateUserCommand,
        UserResponse
      >(command);

      if (result) {
        this.eventEmitter.emit('user.created', result);
      }

      return new ApiResponse(
        HttpStatus.CREATED,
        'Register Successfully',
        result,
      );
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDTO })
  @ApiOkResponse({
    description: 'Login successfully',
  })
  @ApiBadRequestResponse({
    description: 'User not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Password not match',
  })
  async login(@Body() data: LoginDTO, @Res() res: Response) {
    const { email, password } = data;

    try {
      const query = new FindUserByEmailQuery(email);

      const user = await this.queryBus.execute<
        FindUserByEmailQuery,
        UserResponse | null
      >(query);
      if (!user) throw new BadRequestException('User not found');

      const validate = await this.validateUserCredentials.execute({
        password,
        user,
      });
      if (!validate) throw new UnauthorizedException('Password not match');

      const { access_token, refresh_token } =
        await this.generateJwtToken.execute(user);

      res.cookie('refresh_token', refresh_token, {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 7 * 24 * 1000,
        sameSite: true,
        path: '/',
      });

      return res.status(HttpStatus.OK).json(
        new ApiResponse(HttpStatus.OK, 'Login successfully', {
          access_token,
        }),
      );
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(DynamicOAuthGuard)
  @Get('login/:provider')
  async handleOAuth(
    @Param('provider') _provider: string,
    @Req() _req: Request,
  ) {}

  @UseGuards(DynamicOAuthGuard)
  @Get('login/:provider/callback')
  async handleOAuthCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Param('provider') provider: string,
    @Query('code') code: string,
  ) {
    let user: UserResponse;

    const { email, password, fullname, phone_number } = (req as any)
      .user as RegisterDTO;

    try {
      const query = new FindUserByEmailQuery(email);

      user = await this.queryBus.execute<
        FindUserByEmailQuery,
        UserResponse | null
      >(query);

      if (user == null) {
        const command = new CreateUserCommand(
          fullname,
          phone_number,
          email,
          password,
          provider,
        );
        const result = await this.commandBus.execute<
          CreateUserCommand,
          UserResponse
        >(command);

        if (result != null) {
          this.eventEmitter.emit('user.oauth', user);

          user = result;
        } else {
          throw new InternalServerErrorException();
        }
      }

      const { access_token, refresh_token } =
        await this.generateJwtToken.execute(user);

      res.cookie('access_token', access_token, {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000,
        path: '/',
        sameSite: 'lax',
      });

      res.cookie('refresh_token', refresh_token, {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 7 * 24 * 1000,
        path: '/',
        sameSite: 'lax',
      });

      return res
        .status(HttpStatus.OK)
        .json(new ApiResponse(HttpStatus.OK, 'OAuth success', null));
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  @ApiOkResponse({
    description: 'Refresh token granted',
  })
  @ApiUnauthorizedResponse({
    description: 'Credentials expired',
  })
  public async getMe(@Req() req: Request, @Res() res: Response) {
    try {
      const { access_token } = await this.generateRefreshToken.execute({
        sub: (req as any).user.sub,
        email: (req as any).user.email,
      });
      if (!access_token) throw new UnauthorizedException('Credentials expired');

      res.cookie('access_token', access_token, {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000,
        sameSite: true,
      });

      return res.status(HttpStatus.OK).json(
        new ApiResponse(HttpStatus.OK, 'Refresh token granted', {
          access_token,
        }),
      );
    } catch (error) {
      throw error;
    }
  }
}
