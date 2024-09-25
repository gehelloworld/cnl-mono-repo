import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),  
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'), 
      // need to be added to Authorized redirect URIs in Google Cloud Console
      // APIs & Services > Crendentials > Web client 1 > Authorized redirect URIs
      callbackURL: 'http://localhost:4000/api/auth/google/callback',  
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0]?.value,
      firstName: name?.givenName,
      lastName: name?.familyName,
      picture: photos[0]?.value,
      accessToken,
    };
    done(null, user);  // Ensure the user is passed to `done`
  }
}