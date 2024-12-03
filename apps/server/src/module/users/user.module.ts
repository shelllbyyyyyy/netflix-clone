import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { JwtStrategy } from '@/common/startegies/jwt.startegy';
import { BcryptService } from '@/shared/libs/bcrypt';
import { ESUserRepository, PGUserRepository } from '@/shared/libs/constant';

import { UserCommands } from './application/commands';
import { UserQueries } from './application/queries';
import { PGUserRepositoryImpl } from './infrastructure/repositories/pg.user.repository.impl';
import { ESUserRepositoryImpl } from './infrastructure/repositories/es.user.repository.impl';
import { UserController } from './user.controller';
import { HandlerService } from './application/service/handler-service';

const PG = {
  provide: PGUserRepository,
  useClass: PGUserRepositoryImpl,
};

const ES = {
  provide: ESUserRepository,
  useClass: ESUserRepositoryImpl,
};

@Module({
  imports: [CqrsModule],
  providers: [
    ...UserQueries,
    ...UserCommands,
    BcryptService,
    PG,
    ES,
    HandlerService,
    JwtStrategy,
  ],
  controllers: [UserController],
})
export class UserModule {}
