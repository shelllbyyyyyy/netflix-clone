import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ApiResponse, ApiResponsePagination } from '@/common/response/api';
import { User } from '@/common/decorator/user.decorator';
import { InvalidInputError } from '@/common/exceptions/invalid-input.error';

import {
  GetAllUserQuery,
  FindUserByEmailQuery,
  FindUserByIdQuery,
  FindUserByPhoneNumberQuery,
} from './application/queries';
import { UserResponse } from './application/response/user.reponse';
import { UpdateUserDTO } from './application/dto/update-user.dto';
import { HandlerService } from './application/service/handler-service';
import { FilterUserDTO } from './application/dto/filter-user.dto';
import { FindUserByFilterQuery } from './application/queries/find-user-by-filter.query';
import { Pagination } from '@/common/interface/pagination-search.result';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly handlerService: HandlerService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({
    description: 'List of users',
  })
  public async getAllUsers() {
    try {
      const query = new GetAllUserQuery();

      const users = await this.queryBus.execute<
        GetAllUserQuery,
        UserResponse[]
      >(query);

      return new ApiResponse(HttpStatus.OK, 'List of users', users);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('phone-number/:phone_number')
  @ApiParam({ name: 'phone_number' })
  @ApiOkResponse({ description: 'User found' })
  @ApiNotFoundResponse({ description: 'User not found' })
  public async getUserByPhoneNumber(@Param('phone_number') param: string) {
    try {
      const query = new FindUserByPhoneNumberQuery(param);

      const user = await this.queryBus.execute<
        FindUserByPhoneNumberQuery,
        UserResponse
      >(query);

      if (!user) throw new NotFoundException('User not found');

      return new ApiResponse(HttpStatus.OK, 'User found', user);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('email/:email')
  @ApiParam({ name: 'email' })
  @ApiOkResponse({ description: 'User found' })
  @ApiNotFoundResponse({ description: 'User not found' })
  public async getUserByEmail(@Param('email') param: string) {
    try {
      const query = new FindUserByEmailQuery(param);

      const user = await this.queryBus.execute<
        FindUserByEmailQuery,
        UserResponse
      >(query);

      if (!user) throw new NotFoundException('User not found');

      return new ApiResponse(HttpStatus.OK, 'User found', user);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('id/:id')
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ description: 'User found' })
  @ApiNotFoundResponse({ description: 'User not found' })
  public async getUserById(@Param('id') param: string) {
    try {
      const query = new FindUserByIdQuery(param);

      const user = await this.queryBus.execute<FindUserByIdQuery, UserResponse>(
        query,
      );

      if (!user) throw new NotFoundException('User not found');

      return new ApiResponse(HttpStatus.OK, 'User found', user);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/action/:action')
  @ApiParam({ name: 'action' })
  @ApiBody({ type: UpdateUserDTO })
  @ApiOkResponse({ description: 'User updated' })
  @ApiUnauthorizedResponse({ description: 'Password not match' })
  @ApiBadRequestResponse({ description: 'Error' })
  public async updateUser(
    @User() user: any,
    @Body() payload: UpdateUserDTO,
    @Param('action') action: string,
  ) {
    try {
      const query = new FindUserByEmailQuery(user.email);
      const currentUser = await this.queryBus.execute<
        FindUserByEmailQuery,
        UserResponse
      >(query);

      const result = await this.handlerService.handleUserAction(
        action,
        currentUser,
        payload,
      );

      return new ApiResponse(HttpStatus.OK, 'User updated', result);
    } catch (error) {
      if (error instanceof InvalidInputError) {
        if (error.message === 'Password not match') {
          throw new UnauthorizedException(error.message);
        } else {
          throw new BadRequestException(error.message);
        }
      }
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiQuery({
    type: FilterUserDTO,
  })
  @ApiOkResponse({
    description: 'User found',
  })
  @Get('/search')
  public async findUserByFilter(@Query() data: FilterUserDTO) {
    const {
      created_at,
      created_at_end,
      created_at_start,
      email,
      fullname,
      is_verified,
      limit,
      order_by,
      page,
      phone_number,
      provider,
      userId,
      profile_id,
    } = data;

    try {
      const query = new FindUserByFilterQuery(
        userId,
        profile_id,
        fullname,
        phone_number,
        email,
        is_verified,
        provider,
        order_by,
        limit,
        created_at,
        created_at_start,
        created_at_end,
        page,
      );

      const result = await this.queryBus.execute<
        FindUserByFilterQuery,
        Pagination<UserResponse[]>
      >(query);

      return new ApiResponsePagination(
        HttpStatus.OK,
        'User found',
        result.data,
        result.total,
        result.limit,
        result.page,
        result.total_pages,
      );
    } catch (error) {
      throw error;
    }
  }
}
