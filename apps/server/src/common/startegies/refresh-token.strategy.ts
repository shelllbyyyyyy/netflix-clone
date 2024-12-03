import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { publicKey } from '@/shared/modules';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: publicKey,
      ignoreExpiration: false,
    });
  }

  validate(payload: any) {
    return {
      sub: payload.sub,
      email: payload.email,
    };
  }
}
