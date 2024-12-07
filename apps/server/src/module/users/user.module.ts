import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { JwtStrategy } from '@/common/startegies/jwt.startegy';
import { BcryptService } from '@/shared/libs/bcrypt';
import {
  ESProfileRepository,
  ESUserRepository,
  PGProfileRepository,
  PGUserRepository,
} from '@/shared/libs/constant';

import { UserCommands } from './application/commands';
import { UserQueries } from './application/queries';
import { PGUserRepositoryImpl } from './infrastructure/repositories/pg.user.repository.impl';
import { ESUserRepositoryImpl } from './infrastructure/repositories/es.user.repository.impl';
import { UserController } from './user.controller';
import { HandlerService } from './application/service/handler-service';
import { ProfileController } from './profile.controller';
import { PGProfileRepositoryImpl } from './infrastructure/repositories/pg.profile.repository.impl';
import { ESProfileRepositoryImpl } from './infrastructure/repositories/es.profile.repository,impl';

const PGUser = {
  provide: PGUserRepository,
  useClass: PGUserRepositoryImpl,
};

const ESUser = {
  provide: ESUserRepository,
  useClass: ESUserRepositoryImpl,
};

const PGProfile = {
  provide: PGProfileRepository,
  useClass: PGProfileRepositoryImpl,
};

const ESProfile = {
  provide: ESProfileRepository,
  useClass: ESProfileRepositoryImpl,
};

@Module({
  imports: [CqrsModule],
  providers: [
    ...UserQueries,
    ...UserCommands,
    BcryptService,
    PGUser,
    ESUser,
    PGProfile,
    ESProfile,
    HandlerService,
    JwtStrategy,
  ],
  controllers: [UserController, ProfileController],
  exports: [PGProfile, ESProfile, PGUser, ESUser],
})
export class UserModule {}
