import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { GoogleOauthStrategy } from '@/common/startegies/google.oauth.strategy';
import { GithubOAuthStrategy } from '@/common/startegies/github.oauth.strategy';
import { LocalStrategy } from '@/common/startegies/local.startegy';
import { BcryptService } from '@/shared/libs/bcrypt';
import { Tokenizer } from '@/shared/libs/tokenizer';
import { ESUserRepository, PGUserRepository } from '@/shared/libs/constant';

import { ValidateUserCredentials } from './service/validate-user-credentials';
import { GenerateJwtToken } from './service/generate-jwt-token';
import { AuthController } from './auth.controller';
import { PGUserRepositoryImpl } from '../users/infrastructure/repositories/pg.user.repository.impl';
import { ESUserRepositoryImpl } from '../users/infrastructure/repositories/es.user.repository.impl';
import { GenerateRefreshToken } from './service/generate-refresh-token';
import { RefreshTokenStrategy } from '@/common/startegies/refresh-token.strategy';

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
  controllers: [AuthController],
  providers: [
    BcryptService,
    ValidateUserCredentials,
    GenerateJwtToken,
    GenerateRefreshToken,
    RefreshTokenStrategy,
    LocalStrategy,
    GoogleOauthStrategy,
    GithubOAuthStrategy,
    Tokenizer,
    PG,
    ES,
  ],
  exports: [PGUserRepository, ESUserRepository],
})
export class AuthModule {}
