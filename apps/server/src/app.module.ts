import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule, JwtModule, ThrottleModule } from './shared/modules';
import { RedisModule } from './shared/libs/redis/redis.module';
import { SearchModule } from './shared/libs/elastic/search.module';
import { DatabaseModule } from './shared/libs/pg/database.module';
import { CLoudinaryModules } from './shared/libs/cloudinary/cloudinary.module';
import { UserModule } from './module/users/user.module';
import { AuthModule } from './module/auth/auth.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ThrottleModule,
    JwtModule,
    ConfigModule,
    RedisModule,
    DatabaseModule,
    CLoudinaryModules,
    SearchModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
