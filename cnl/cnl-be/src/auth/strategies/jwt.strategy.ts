// jwt.strategy.ts
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigurationService } from 'src/configuration/configuration.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(private configService: ConfigurationService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token = req?.cookies?.auth_token || null;
          this.logger.log(`Extracted token from cookie: ${token}`);
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getJwtSecret(),
    });
    this.logger.log('JwtStrategy initialized');
  }

  async validate(payload: {
    email: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
    iat: number;
    exp: number;
  }) {
    this.logger.log(`Validating payload: ${JSON.stringify(payload)}`);
    return {
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      profilePicture: payload.profilePicture,
    };
  }
}
